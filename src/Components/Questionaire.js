import React, { useState } from "react";
import { firestore } from "../firebase"; // Adjust path as per your Firebase setup
import "./Questionaire.css"; // Add your styles for the questionnaire

const topics = [
  "Music", "Art", "Technology", "Sports", "Gaming", "Cooking", "Dance", "Health",
  "Fitness", "Education", "Career", "Business", "Finance", "Literature", "Travel",
  "Fashion", "Politics", "Science", "History", "Movies", "Theater", "Photography",
  "Social", "Environment", "Wildlife", "Social Issues", "Community"
];

const Questionnaire = () => {
  const [selectedTopics, setSelectedTopics] = useState({
    utmost: [],
    medial: [],
    minimal: []
  });

  const [currentPriority, setCurrentPriority] = useState("utmost");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userId = "uniqueUserId"; // This should be dynamically set to the logged-in user's ID

  const handleTopicClick = (topic) => {
    const totalSelected = selectedTopics.utmost.length + selectedTopics.medial.length + selectedTopics.minimal.length;

    // Prevent selecting more than 9 topics in total
    if (totalSelected >= 9) return;

    // Check if the topic is already selected
    if (selectedTopics.utmost.includes(topic) || selectedTopics.medial.includes(topic) || selectedTopics.minimal.includes(topic)) {
      return;
    }

    setSelectedTopics((prev) => {
      const newSelection = { ...prev };
      newSelection[currentPriority].push(topic);

      // Switch priority if needed
      if (newSelection.utmost.length === 3) {
        setCurrentPriority("medial");
      }
      if (newSelection.medial.length === 3) {
        setCurrentPriority("minimal");
      }

      return newSelection;
    });
  };

  const handleSavePreferences = async () => {
    setError("");
    setSuccessMessage("");

    try {
      await firestore.collection("users").doc(userId).set({
        preferences: {
          utmost: selectedTopics.utmost,
          medial: selectedTopics.medial,
          minimal: selectedTopics.minimal
        }
      }, { merge: true });

      setSuccessMessage("Preferences saved successfully!");
    } catch (error) {
      setError("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="questionnaire-container">
      <h2>Select Your Event Preferences</h2>
      <p>Click on topics to prioritize them. First select utmost interest, then medial, then minimal.</p>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic}
            className={`topic-card ${selectedTopics.utmost.includes(topic) ? "utmost-selected" : selectedTopics.medial.includes(topic) ? "medial-selected" : selectedTopics.minimal.includes(topic) ? "minimal-selected" : ""}`}
            onClick={() => handleTopicClick(topic)}
            style={{
              cursor: (selectedTopics.utmost.includes(topic) || selectedTopics.medial.includes(topic) || selectedTopics.minimal.includes(topic) || (selectedTopics.utmost.length + selectedTopics.medial.length + selectedTopics.minimal.length >= 9)) ? 'not-allowed' : 'pointer',
              backgroundColor: (selectedTopics.utmost.includes(topic) || selectedTopics.medial.includes(topic) || selectedTopics.minimal.includes(topic)) ? 'lightyellow' : ''
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
