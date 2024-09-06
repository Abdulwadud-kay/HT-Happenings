import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import './CreateEvent.css';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const topics = [
  "Music", "Art", "Technology", "Sports", "Gaming", "Cooking", "Dance", "Health",
  "Fitness", "Education", "Career", "Business", "Finance", "Literature", "Travel",
  "Fashion", "Politics", "Science", "History", "Movies", "Theater", "Photography",
  "Social", "Environment", "Wildlife", "Social Issues", "Community"
];

const EventCreate = ({ editingEvent, setEditingEvent }) => {
  const [eventName, setEventName] = useState(editingEvent ? editingEvent.name : '');
  const [eventLocation, setEventLocation] = useState(editingEvent ? editingEvent.location : '');
  const [eventDate, setEventDate] = useState(editingEvent ? editingEvent.date : '');
  const [eventTime, setEventTime] = useState(editingEvent ? editingEvent.time : '');
  const [eventDescription, setEventDescription] = useState(editingEvent ? editingEvent.description : '');
  const [eventCategory, setEventCategory] = useState(editingEvent ? editingEvent.category : '');
  const [allowSignup, setAllowSignup] = useState(editingEvent ? editingEvent.allowSignup : false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (editingEvent) {
      setEventName(editingEvent.name);
      setEventLocation(editingEvent.location);
      setEventDate(editingEvent.date);
      setEventTime(editingEvent.time);
      setEventDescription(editingEvent.description);
      setEventCategory(editingEvent.category);
      setAllowSignup(editingEvent.allowSignup);

      console.log('Editing event ID:', editingEvent.id);
    }
  }, [editingEvent]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!eventName || !eventLocation || !eventDate || !eventTime || !eventCategory) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Validate date and time
    const selectedDateTime = new Date(`${eventDate}T${eventTime}`);
    const currentDateTime = new Date();
    const minAllowedDateTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000);

    if (selectedDateTime < minAllowedDateTime) {
      setErrorMessage('Event date and time must be at least 30 minutes in the future.');
      return;
    }

    
    try {
        if (!user) {
          throw new Error('User not authenticated');
        }
  
        const eventsCollectionRef = collection(firestore, 'events');
  
        if (editingEvent) {
          // Update existing event
          const eventRef = doc(eventsCollectionRef, editingEvent.id);
          await setDoc(eventRef, {
            name: eventName,
            location: eventLocation,
            date: eventDate,
            time: eventTime,
            description: eventDescription,
            category: eventCategory,
            allowSignup: allowSignup,
            userID: user.uid, // Include user ID to identify the event creator
          }, { merge: true });
  
          setSuccessMessage('Event updated successfully!');
          setEditingEvent(null); // Clear editing state after update
        } else {
          // Create new event
          await setDoc(doc(eventsCollectionRef), {
            name: eventName,
            location: eventLocation,
            date: eventDate,
            time: eventTime,
            description: eventDescription,
            category: eventCategory,
            allowSignup: allowSignup,
            userID: user.uid, // Include user ID to identify the event creator
          });
  
          setSuccessMessage('Event created successfully!');
        }
  
        // Clear the form
        setEventName('');
        setEventLocation('');
        setEventDate('');
        setEventTime('');
        setEventDescription('');
        setEventCategory('');
        setAllowSignup(false);
      } catch (error) {
        setErrorMessage('Failed to save event. Please try again.');
        console.error('Error saving event:', error);
      }
    };
  return (
    <div className="create-event-container">
      <a href="#!" onClick={() => navigate('/home')} className="back-link">
        Back
      </a>

      <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleCreateEvent} className="create-event-form">
        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={allowSignup}
              onChange={(e) => setAllowSignup(e.target.checked)}
            />
            Is this a sign-up event?
          </label>
        </div>
        <button type="submit" className="create-event-button">
          {editingEvent ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventCreate;
