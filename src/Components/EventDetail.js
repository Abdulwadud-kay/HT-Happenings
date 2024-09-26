import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Use the correct Firestore functions
import { firestore } from "../firebase"; // Import Firestore
import './detailEvent.css'; // Import specific CSS for event details
import { parseText } from './textParser';
import { auth } from '../firebase'; // Import Firebase authentication

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const EventDetail = () => {
  const { eventId } = useParams(); // Retrieve the event ID from URL params
  const [event, setEvent] = useState(null);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signupData, setSignupData] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(firestore, "events", eventId); // Adjust the path to point to the correct collection
        const eventDoc = await getDoc(eventRef);
        
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          console.error("Event not found!");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSignupClick = () => {
    setShowSignupForm(true);
  };

  const handleInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    // Ensure the user is authenticated
    if (!auth.currentUser) {
      alert("Please log in to sign up for events");
      return;
    }

    const eventRef = doc(firestore, "events", eventId);
    const userRef = doc(firestore, "users", auth.currentUser.uid);

    try {
      // First, get the current event data
      const eventDoc = await getDoc(eventRef);
      const currentEvent = eventDoc.data();

      // Prepare the new signup
      const newSignup = {
        ...signupData
      };

      // Update the signups array
      let updatedSignups = currentEvent.signups || [];
      updatedSignups.push(newSignup);

      // Update the event document with the new signups
      await setDoc(eventRef, {
        signups: updatedSignups
      }, { merge: true });

      // Get the user's current preferences
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      let updatedPreferences = new Set(userData.preferences || []);

      // Add the event category to the user's preferences
      if (currentEvent.category) {
        updatedPreferences.add(currentEvent.category);
      }

      // Convert the Set back to an array
      updatedPreferences = Array.from(updatedPreferences);

      // Update the user's document with the new preferences
      await setDoc(userRef, {
        preferences: updatedPreferences
      }, { merge: true });

      alert("You have successfully signed up for this event!");
      setShowSignupForm(false);
      setSignupData({});
      setAgreeToTerms(false);
    } catch (error) {
      console.error("Error signing up for event:", error);
      alert("Failed to sign up for the event. Please try again.");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-detail-page">
      {event.imageURL && <img src={event.imageURL} alt={event.name} className="event-image-detail" />}
      <h1 className="event-name">{event.name}</h1>
      <p className="event-location">{event.location}</p>
      <p className="event-date">{formatDate(event.date)}</p>
      <p className="event-time">{formatTime(event.time)}</p>
      <p className="event-description">{event.description}</p>
      {event.additionalInfo && (
        <div className="additional-info">
          <h4>Additional Information:</h4>
          <p>{parseText(event.additionalInfo)}</p>
        </div>
      )}
      {event.allowSignup && !showSignupForm && (
        <button className="sign-up-button" onClick={handleSignupClick}>Sign Up</button>
      )}
      {showSignupForm && (
        <form onSubmit={handleSubmit} className="signup-form">
          {event.signupOptions?.name && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleInputChange}
              required
            />
          )}
          {event.signupOptions?.email && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
            />
          )}
          {event.signupOptions?.custom && event.customSignupField && (
            <input
              type="text"
              name="custom"
              placeholder={event.customSignupField}
              onChange={handleInputChange}
              required
            />
          )}
          <label>
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            I agree to the terms and conditions
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      {!event.allowSignup && (
        <p>This is a view-only event.</p>
      )}
    </div>
  );
};

export default EventDetail;
