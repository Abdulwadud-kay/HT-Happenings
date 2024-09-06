import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import EventDraft from './EventDraft';
import EventCreate from './EventCreate';
import './myEvents.css';

const MyEventsPage = () => {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (user) {
        try {
          const eventsCollection = collection(firestore, 'events');
          const q = query(eventsCollection, where('userID', '==', user.uid));
          const querySnapshot = await getDocs(q);

          const myEvents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setEvents(myEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };

    fetchMyEvents();
  }, [user]);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  return (
    <div className="my-events-page">
      <h2>My Events</h2>
      {events.map((event) => (
        <EventDraft
          key={event.id}
          event={event}
          isMyEventsPage={true}
          onEdit={handleEdit}
        />
      ))}
      {editingEvent && (
        <EventCreate existingEvent={editingEvent} />
      )}
    </div>
  );
};

export default MyEventsPage;
