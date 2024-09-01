import React, { useState, useEffect } from 'react';
import { firestore } from "../firebase"; // Import Firestore
import { collection, getDocs } from "firebase/firestore";
import EventDraft from './EventDraft'; // Import the EventDraft component
import './HomePage.css'; // Import CSS specific to the HomePage

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
          // Fetch all users
          const usersCollection = collection(firestore, "users");
          const usersSnapshot = await getDocs(usersCollection);
      
          const allEvents = [];
          for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
      
            // Fetch events for each user
            const userEventsCollection = collection(firestore, `users/${userId}/events`);
            const eventsSnapshot = await getDocs(userEventsCollection);
            const eventsData = eventsSnapshot.docs.map(doc => ({
              id: doc.id, // Capture the unique event ID
              ...doc.data()
            }));
      
            allEvents.push(...eventsData);
          }
      
          setEvents(allEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };
    fetchEvents();
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <EventDraft key={event.id} event={event} /> // Pass event data to EventDraft
        ))}
      </div>
    </div>
  );
};

export default Home;
