import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css'; // Include your CSS styles

const EventDraft = ({ event }) => {
    console.log('EventDraft props:', event);
  
  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/eventdetail/${event.id}`); // Navigate to the EventDetail page with event ID
  };

  return (
    <div className="event-draft-box">
      {/* Assuming these fields are present in the event object */}
      <h3 className="event-name">{event.name}</h3>
      <p className="event-location">{event.location}</p>
      <div className="event-time-container">
        <p className="event-date">{event.date}</p>
        <p className="event-time">{event.time}</p>
      </div>
      {event.allowSignup ? (
        <button 
          className="sign-up-button" 
          onClick={handleClick} // Navigate to event details when clicked
        >
          Sign Up
        </button>
      ) : (
        <button 
          className="learn-more-link" 
          onClick={handleClick} // Navigate to event details when clicked
        >
          Learn More
        </button>
      )}
    </div>
  );
};

export default EventDraft;
