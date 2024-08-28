import React from 'react';
import './Events.css'; // Create this file for your CSS styles

const EventDraft = ({ event }) => {
  return (
    <div className="event-draft-box">
      <h3 className="event-name">{event.name}</h3>
      <p className="event-location">{event.location}</p>
      <p className="event-time">{event.time}</p>
    </div>
  );
};

export default EventDraft;
