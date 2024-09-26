import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css'; // Include your CSS styles

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const EventDraft = ({ event, isMyEventsPage, onEdit, onDelete, onSendEmails }) => {
  console.log('EventDraft event:', event); // Debugging log

  const navigate = useNavigate();
  const [showSignups, setShowSignups] = useState(false);
  const customInfoRef = useRef(null);

  const getCustomInfo = () => {
    if (!event.signups || event.signups.length === 0) return '';
    
    return event.signups.map(signup => {
      if (event.signupOptions?.email) {
        return `${signup.email}: ${signup.custom}`;
      } else if (event.signupOptions?.name) {
        return `${signup.name}: ${signup.custom}`;
      }
      return signup.custom;
    }).join(', ');
  };

  const handleClick = () => {
    navigate(`/eventdetail/${event.id}`); // Navigate to the EventDetail page with event ID
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this event?");
    if (isConfirmed) {
      onDelete(event.id); // Call the delete function passed via props
    }
  };

  const handleSignupsClick = () => {
    setShowSignups(!showSignups);
  };

  const handleSendEmails = () => {
    if (event.signups && event.signups.length > 0) {
      const subject = encodeURIComponent(`Regarding ${event.name}`);
      const body = encodeURIComponent(`Dear attendee,\n\nThis email is regarding the event "${event.name}".\n\nBest regards,\n[Your Name]`);
      const bcc = event.signups.map(signup => signup.email).join(',');
      window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
    } else {
      alert('No signups for this event yet.');
    }
  };

  const handleCopyCustomInfo = () => {
    if (customInfoRef.current) {
      const customInfo = getCustomInfo();
      navigator.clipboard.writeText(customInfo).then(() => {
        alert('Custom info copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <div className="event-draft-box">
      {event.imageURL && <img src={event.imageURL} alt={event.name} className="event-image" />}
      <div className="event-info">
        <h3 className="event-name">{event.name}</h3>
        <p className="event-location">{event.location}</p>
        <p className="event-datetime">
          <span className="event-date">{formatDate(event.date)}</span>
          <span className="event-time">{formatTime(event.time)}</span>
        </p>
      </div>
      {isMyEventsPage ? (
        <div className="event-actions">
          <button className="action-button edit-button" onClick={() => onEdit(event)}>Edit</button>
          <button className="action-button delete-button" onClick={handleDelete}>Delete</button>
          {event.allowSignup && (
            <button className="action-button signups-button" onClick={handleSignupsClick}>
              Signups: ({event.signups ? event.signups.length : 0})
            </button>
          )}
          {event.signupOptions?.custom && (
            <div className="custom-field-container">
              <input
                ref={customInfoRef}
                type="text"
                readOnly
                value={getCustomInfo()}
                className="custom-field"
              />
              <button className="action-button copy-button" onClick={handleCopyCustomInfo}>Copy</button>
            </div>
          )}
        </div>
      ) : (
        <button 
          className={event.allowSignup ? "sign-up-button" : "learn-more-link"} 
          onClick={handleClick}
        >
          {event.allowSignup ? "Sign Up" : "Learn More"}
        </button>
      )}
      {showSignups && (
        <div className="signups-details">
          {Array.isArray(event.signups) && event.signups.length > 0 ? (
            <ul>
              {event.signups.map((signup, index) => (
                <li key={index}>{signup}</li>
              ))}
            </ul>
          ) : (
            <p>No signups yet.</p>
          )}
          {event.signupOptions?.email && (
            <button className="action-button send-emails-button" onClick={handleSendEmails}>
              Send Emails
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDraft;
