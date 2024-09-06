import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css'; // Include your CSS styles

const EventDraft = ({ event, isMyEventsPage, onEdit }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/eventdetail/${event.id}`); // Navigate to the EventDetail page with event ID
  };

  return (
    <div className="event-draft-box">
      <h3 className="event-name">{event.name}</h3>
      <p className="event-location">{event.location}</p>
      <div className="event-time-container">
        <p className="event-date">{event.date}</p>
        <p className="event-time">{event.time}</p>
      </div>

      {isMyEventsPage ? (
        <div>
          {event.allowSignup && (
            <div className="signups-info">
              {/* Display some information about signups */}
              {/* This part can show the number of signups or other details */}
              Signups: {/* Example - Replace with actual data */}
            </div>
          )}
          <button
            className="edit-button"
            onClick={() => onEdit(event)} // Edit button functionality
          >
            Edit
          </button>
        </div>
      ) : (
        event.allowSignup ? (
          <button className="sign-up-button" onClick={handleClick}>
            Sign Up
          </button>
        ) : (
          <button className="learn-more-link" onClick={handleClick}>
            Learn More
          </button>
        )
      )}
    </div>
  );
};

export default EventDraft;
