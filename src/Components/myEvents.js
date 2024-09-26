import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Removed orderBy
import EventRow from './EventRow'; // We'll create this component
import './myEvents.css';
import { useNavigate } from 'react-router-dom';

const MyEventsPage = () => {
  const [user] = useAuthState(auth);
  const [eventsByMonth, setEventsByMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          const eventsCollection = collection(firestore, 'events');
          const q = query(
            eventsCollection, 
            where('userID', '==', user.uid)
            // Temporarily remove orderBy clause to simplify the query
          );
          const querySnapshot = await getDocs(q);

          const myEvents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          console.log('Fetched my events:', myEvents); // Debugging log

          const groupedEvents = groupEventsByMonth(myEvents);
          setEventsByMonth(groupedEvents);
        } catch (error) {
          console.error('Error fetching events:', error);
          setError('Failed to fetch events. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMyEvents();
  }, [user]);

  const groupEventsByMonth = (events) => {
    const eventsByMonth = {};

    events.forEach(event => {
      console.log('Event:', event); // Debugging log
      console.log('Event createdAt:', event.createdAt); // Debugging log

      // Adjust handling of createdAt based on its type
      let createdAt;
      if (event.createdAt instanceof Date) {
        createdAt = event.createdAt;
      } else if (event.createdAt && typeof event.createdAt.toDate === 'function') {
        createdAt = event.createdAt.toDate();
      } else {
        createdAt = new Date(event.createdAt); // Assuming it's a string
      }

      const month = createdAt.getMonth();
      const year = createdAt.getFullYear();
      const monthYear = `${year}-${month + 1}`;

      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = [];
      }
      eventsByMonth[monthYear].push(event);
    });

    return eventsByMonth;
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const eventRef = doc(firestore, 'events', eventId);
      await deleteDoc(eventRef);
      // Update the state to remove the deleted event
      setEventsByMonth(prevState => {
        const newState = { ...prevState };
        Object.keys(newState).forEach(month => {
          newState[month] = newState[month].filter(event => event.id !== eventId);
          if (newState[month].length === 0) {
            delete newState[month];
          }
        });
        return newState;
      });
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleEdit = (event) => {
    navigate('/EventCreate', { state: { event } });
  };

  const handleSendEmails = (eventId) => {
    const event = Object.values(eventsByMonth).flat().find(e => e.id === eventId);
    if (event && Array.isArray(event.signups) && event.signups.length > 0) {
      const subject = `Email about ${event.name}`;
      const body = `Hello everyone,\n\nThis is regarding the event "${event.name}".\n\nBest regards,\n${user.displayName}`;
      const mailtoLink = `mailto:?bcc=${user.email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
    } else {
      alert('No signups for this event yet.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-events-page">
      <h2>My Events</h2>
      {Object.keys(eventsByMonth).length === 0 ? (
        <p>No events found. Create a new event to see it here.</p>
      ) : (
        Object.entries(eventsByMonth).map(([monthYear, events]) => (
          <EventRow
            key={monthYear}
            monthYear={monthYear}
            events={events}
            onEdit={handleEdit}
            onDelete={handleDeleteEvent}
            onSendEmails={handleSendEmails}
          />
        ))
      )}
    </div>
  );
};

export default MyEventsPage;