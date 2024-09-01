import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from "../firebase"; // Import Firestore
import './detailEvent.css'; // Import specific CSS for event details

const EventDetail = () => {
  const { eventId } = useParams(); // Retrieve the event ID from URL params
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await firestore.collection("events").doc(eventId).get();
        if (eventDoc.exists) {
          setEvent(eventDoc.data());
        } else {
          console.error("Event not found!");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-detail-page">
      <h1 className="event-name">{event.name}</h1>
      <p className="event-location">{event.location}</p>
      <p className="event-date">{event.date}</p>
      <p className="event-time">{event.time}</p>
      <p className="event-description">{event.description}</p>
      {event.allowSignup ? (
        <button className="sign-up-button">Sign Up</button>
      ) : (
        <p>This is a view-only event.</p>
      )}
    </div>
  );
};

export default EventDetail;
