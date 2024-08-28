import React from 'react';
import './detailEvent.css'; // Create this file for your CSS styles

const EventDetail = ({ event }) => {
  return (
    <div className="event-detail-page">
      <h1 className="event-name">{event.name}</h1>
      <p className="event-time">{event.time}</p>
      <p className="event-location">{event.location}</p>
      <p className="event-description">{event.description}</p>
      <button className="sign-up-button">Sign Up</button>
    </div>
  );
};

export default EventDetail;
