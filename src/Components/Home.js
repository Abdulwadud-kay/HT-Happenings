import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import EventDraft from './EventDraft';
import './HomePage.css';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        try {
          const eventsCollection = collection(firestore, 'events');
          const eventsSnapshot = await getDocs(eventsCollection);
          const allEvents = eventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setEvents(allEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };

    fetchEvents();
  }, [user]);

  return (
    <div className="home-container">
      <h1>All Events</h1>
      {/* <div className="events-list"> */}
        {events.map((event) => (
          <EventDraft key={event.id} event={event} />
        ))}
      {/* </div> */}
    </div>
  );
};

export default Home;
