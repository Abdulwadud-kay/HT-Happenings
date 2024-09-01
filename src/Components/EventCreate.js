import React, { useState } from 'react';
import { firestore, auth } from '../firebase'; // Import your Firebase setup
import './CreateEvent.css'; // CSS file for styling the event creation form
import { collection, doc, setDoc } from 'firebase/firestore'; // Correct Firestore imports
import { useAuthState } from 'react-firebase-hooks/auth'; // Import for Firebase hooks
import { useNavigate } from 'react-router-dom';

const topics = [
  "Music", "Art", "Technology", "Sports", "Gaming", "Cooking", "Dance", "Health",
  "Fitness", "Education", "Career", "Business", "Finance", "Literature", "Travel",
  "Fashion", "Politics", "Science", "History", "Movies", "Theater", "Photography",
  "Social", "Environment", "Wildlife", "Social Issues", "Community"
];

const EventCreate = () => {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [allowSignup, setAllowSignup] = useState(false); // New state for sign-up type
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

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
    const minAllowedDateTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000); // 30 minutes into the future

    if (selectedDateTime < minAllowedDateTime) {
      setErrorMessage('Event date and time must be at least 30 minutes in the future.');
      setEventDate(minAllowedDateTime.toISOString().split('T')[0]); // Update to minimum allowed date
      setEventTime(minAllowedDateTime.toTimeString().slice(0, 5)); // Update to minimum allowed time
      return;
    }

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a reference to the user's events sub-collection
      const userEventsCollectionRef = collection(firestore, 'users', user.uid, 'events');
      
      // Create a new document in the user's events sub-collection with an auto-generated ID
      await setDoc(doc(userEventsCollectionRef), {
        name: eventName,
        location: eventLocation,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        category: eventCategory,
        allowSignup: allowSignup, // Store the allowSignup value
      });

      setSuccessMessage('Event created successfully!');
      // Clear the form
      setEventName('');
      setEventLocation('');
      setEventDate('');
      setEventTime('');
      setEventDescription('');
      setEventCategory('');
      setAllowSignup(false); // Reset the allowSignup state
    } catch (error) {
      setErrorMessage('Failed to create event. Please try again.');
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="create-event-container">
      <a href="#!" onClick={() => navigate('/home')} className="back-link">
        Back
      </a>

      <h2>Create New Event</h2>
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
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventCreate;
