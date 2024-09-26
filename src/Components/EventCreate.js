import React, { useState, useEffect } from 'react';
import { firestore, auth, storage, serverTimestamp } from '../firebase'; // Added serverTimestamp
import './CreateEvent.css';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ErrorMessage from './ErrorMessage';

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
  const [allowSignup, setAllowSignup] = useState(false);
  const [signupOptions, setSignupOptions] = useState({
    name: false,
    email: false,
    custom: false
  });
  const [customSignupField, setCustomSignupField] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation(); 
  const editingEvent = location.state?.event;
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleMoreInfoClick = () => {
    setShowMoreInfo(prevState => !prevState); // Toggle the visibility
  };

  const handleSignupOptionChange = (option) => {
    setSignupOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  // Prefill the form if editing an event
  useEffect(() => {
    if (editingEvent) {
      setEventName(editingEvent.name);
      setEventLocation(editingEvent.location);
      setEventDate(editingEvent.date);
      setEventTime(editingEvent.time);
      setEventDescription(editingEvent.description);
      setEventCategory(editingEvent.category);
      setAllowSignup(editingEvent.allowSignup);
      if (editingEvent.imageURL) {
        setImagePreview(editingEvent.imageURL);
      }
    }
  }, [editingEvent]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setEventImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    const imageRef = ref(storage, `eventImages/${user.uid}/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    return getDownloadURL(imageRef);
  };

  const handleCreateOrUpdateEvent = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
  
    if (!eventName || !eventLocation || !eventDate || !eventTime || !eventCategory) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    const selectedDateTime = new Date(`${eventDate}T${eventTime}`);
    const currentDateTime = new Date();
    const minAllowedDateTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000);
  
    if (selectedDateTime < minAllowedDateTime) {
      setErrorMessage('Event date and time must be at least 30 minutes in the future.');
      return;
    }
  
    try {
      let imageURL = editingEvent?.imageURL || '';
      if (eventImage) {
        imageURL = await uploadImage(eventImage);
      }

      const currentDate = new Date();
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      const status = eventDateTime >= currentDate ? 'upcoming' : 'past';

      const eventData = {
        name: eventName,
        location: eventLocation,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        category: eventCategory,
        allowSignup: allowSignup,
        signupOptions: allowSignup ? signupOptions : null,
        customSignupField: allowSignup && signupOptions.custom ? customSignupField : null,
        additionalInfo: additionalInfo,
        userID: user.uid,
        imageURL: imageURL,
        status: status,
        createdAt: serverTimestamp(), // Use serverTimestamp here
        updatedAt: serverTimestamp() // Add this line to track updates
      };

      let eventId;
      if (editingEvent) {
        // Update existing event
        const eventRef = doc(firestore, 'events', editingEvent.id);
        await updateDoc(eventRef, {
          ...eventData,
          updatedAt: serverTimestamp() // Only update the updatedAt field
        });
        eventId = editingEvent.id;
      } else {
        // Create new event
        const eventsCollectionRef = collection(firestore, 'events');
        const docRef = await addDoc(eventsCollectionRef, eventData);
        eventId = docRef.id;
      }

      console.log('Event saved successfully:', eventId);
      setSuccessMessage(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
      navigate('/myEvents');
  
      // Clear the form
      setEventName('');
      setEventLocation('');
      setEventDate('');
      setEventTime('');
      setEventDescription('');
      setEventCategory('');
      setAllowSignup(false);
      setAdditionalInfo('');
      setEventImage(null);
  
    } catch (error) {
      console.error('Error saving event:', error);
      setErrorMessage('Failed to save event. Please try again.');
    }
  };

  return (
    <div className="create-event-container">
      <a href="#!" onClick={() => navigate('/home')} className="back-link">
        Back
      </a>

      <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleCreateOrUpdateEvent} className="create-event-form">
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
          <label>Event Image (optional):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Event preview" style={{maxWidth: '200px', marginTop: '10px'}} />
          )}
        </div>
        <div className="form-group-checkbox">
          <label>
            <input
              type="checkbox"
              checked={allowSignup}
              onChange={(e) => setAllowSignup(e.target.checked)}
            />
            Is this a sign-up event?
          </label>
        </div>

        {allowSignup && (
          <div className="signup-options">
            <p>Select required information for sign-up:</p>
            {Object.keys(signupOptions).map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={signupOptions[option]}
                  onChange={() => handleSignupOptionChange(option)}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
            {signupOptions.custom && (
              <input
                type="text"
                value={customSignupField}
                onChange={(e) => setCustomSignupField(e.target.value)}
                placeholder="Enter custom field name"
              />
            )}
          </div>
        )}

        {/* More Info Button */}
        <button type="button" className="more-info-button" onClick={handleMoreInfoClick}>
         {showMoreInfo ? '− Less Info' : '+ More Info'}
        </button>

        {/* Conditionally render additional info text box */}
        {showMoreInfo && (
          <div className="form-group">
            <label>Additional Information:</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows="4" // Adjust rows to make it tall enough
              placeholder="Links and emails" // Placeholder text
            ></textarea>
          </div>
        )}

        <button type="submit" className="create-event-button">
          {editingEvent ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventCreate;