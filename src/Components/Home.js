import React, { useState, useEffect, useCallback } from 'react';
import { firestore, auth } from '../firebase';  // Import auth from firebase
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';  // Import useAuthState hook
import EventDraft from './EventDraft';
import { getAIPrioritization } from '../OpenAiService';  // Import the OpenAI service
import './HomePage.css';

// Fetch user preferences from Firestore
const fetchUserPreferences = async (userID) => {
  try {
    if (!userID) throw new Error('No userID provided');
    const userDoc = await getDoc(doc(firestore, 'users', userID));
    return userDoc.exists() ? userDoc.data().preferences : [];
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return [];
  }
};

// Updated AI function to prioritize events
const getAIPrioritizedEvents = async (events, preferences) => {
  try {
    // Format the updated prompt for OpenAI
    const prompt = `
      Here is a list of events: ${JSON.stringify(events)}.
      User preferences (including favorite categories and categories of signed-up events) are: ${JSON.stringify(preferences)}.
      Please return a prioritized list of events considering these preferences.
    `;

    // Call OpenAI to get a prioritized list
    const response = await getAIPrioritization(prompt);
    console.log('AI Response:', response);  // Log the full response
    console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);

    let prioritizedEvents;
    try {
      // Attempt to parse the AI response into JSON
      prioritizedEvents = JSON.parse(response.choices[0].text.trim());
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
      // Handle parsing error (e.g., log it, fallback behavior)
      prioritizedEvents = []; // or a fallback strategy
    }

    return prioritizedEvents;
  } catch (error) {
    console.error('AI prioritization error:', error);
    console.error('Error details:', error.response?.data);  // Log additional error details
    // Return the original events if AI prioritization fails
    return events;
  }
};

const Home = () => {
  const [user, loading, error] = useAuthState(auth);  // Use useAuthState hook
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!user) return;  // Don't fetch if user is not logged in

    try {
      setLoadingEvents(true);

      // Fetch user preferences
      const preferences = await fetchUserPreferences(user.uid);

      // Fetch all upcoming events from Firestore
      const eventsCollection = collection(firestore, 'events');
      const currentDate = new Date().toISOString().split('T')[0];
      const q = query(
        eventsCollection,
        where('date', '>=', currentDate)
      );
      const eventsSnapshot = await getDocs(q);
      const activeEvents = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Call AI for prioritization based on preferences
      const aiPrioritizedEvents = await getAIPrioritizedEvents(activeEvents, preferences);

      // If AI successfully prioritizes events, use them; otherwise, fallback to default sorting
      const finalEvents = aiPrioritizedEvents.length > 0 ? aiPrioritizedEvents : sortEvents(activeEvents);

      console.log('Fetched events:', finalEvents); // Debugging log
      setEvents(finalEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEventsError("Failed to fetch events. Please try again.");
    } finally {
      setLoadingEvents(false);
    }
  }, [user]);  // Depend on user instead of userID

  useEffect(() => {
    if (!loading && user) {
      fetchEvents();
    }
  }, [fetchEvents, loading, user]);

  // Default sorting function (used if AI fails or doesn't return results)
  const sortEvents = (events) => {
    return events.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA - dateB;
    });
  };

  const handleEventDeleted = (deletedEventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== deletedEventId));
  };

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Please log in to view events.</div>;

  if (loadingEvents) return <div>Loading events...</div>;
  if (eventsError) return <div>{eventsError}</div>;

  return (
    <div className="home-container">
      <h2>All Events</h2>
      <div className="events-list">
        {events.length === 0 ? (
          <p>No upcoming events found.</p>
        ) : (
          events.map((event, index) => (
            <EventDraft 
              key={event.id} 
              event={event} 
              isMyEventsPage={false} 
              onDelete={handleEventDeleted}
              style={{
                gridRow: Math.floor(index / 3) + 1,
                gridColumn: (index % 3) + 1
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
