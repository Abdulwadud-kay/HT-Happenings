import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase"; // Ensure your Firebase setup exports auth and firestore correctly
import "./Questionaire.css"; // Add your styles for the questionnaire
import { doc, setDoc } from "firebase/firestore"; // Import necessary Firestore functions
import { useNavigate } from "react-router-dom";

const topics = [
  "Music", "Art", "Technology", "Sports", "Gaming", "Cooking", "Dance", "Health",
  "Fitness", "Education", "Career", "Business", "Finance", "Literature", "Travel",
  "Fashion", "Politics", "Science", "History", "Movies", "Theater", "Photography",
  "Social", "Environment", "Wildlife", "Social Issues", "Community"
];

const Questionnaire = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User ID:', user.uid); // Log the user ID
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) => {
      // If topic is already selected, remove it
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      }
      
      // If less than 9 topics are selected, add the new topic
      if (prev.length < 3) {
        return [...prev, topic];
      }
      
      return prev; // Do nothing if 9 topics are already selected
    });
  };

  const handleSavePreferences = async () => {
    if (!userId) {
      setError("User not logged in. Please log in to save preferences.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const userDocRef = doc(firestore, "users", userId);
      
      await setDoc(userDocRef, {
        preferences: selectedTopics,
        questionnaireCompleted: true,
      }, { merge: true });

      setSuccessMessage("Preferences saved successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="questionnaire-container">
      <h2>Select Your Topics</h2>
      <p>Select 3 topics that you are interested in. Click on a topic to select or deselect it.</p>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic}
            className={`topic-card ${selectedTopics.includes(topic) ? "selected" : ""}`}
            onClick={() => handleTopicClick(topic)}
            style={{
              cursor: selectedTopics.includes(topic) ? 'not-allowed' : 'pointer',
              backgroundColor: selectedTopics.includes(topic) ? '#FFEB3B' : ''
            }}
          >
            {topic}
          </div>
        ))}
      </div>
      <button onClick={handleSavePreferences} className="save-button">
        Save Preferences
      </button>
    </div>
  );
};

export default Questionnaire;
