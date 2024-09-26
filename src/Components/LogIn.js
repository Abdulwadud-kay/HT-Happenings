import React, { useState } from "react";
import "./AuthStyles.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase"; // Import firestore
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import ErrorMessage from './ErrorMessage';

const LogIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (formData.email === "" || formData.password === "") {
      setError("Please input both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setError("");

      // Fetch the user document from Firestore
      const userId = userCredential.user.uid;
      const userDocRef = doc(firestore, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      // Check if the user document exists and if the questionnaire is completed
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.questionnaireCompleted) {
          navigate("/home"); // Redirect to home if questionnaire is completed
        } else {
          navigate("/questionaire"); // Redirect to questionnaire if not completed
        }
      } else {
        navigate("/questionaire"); // Default to questionnaire if no user data
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleSignIn} className="auth-form">
        {error && <ErrorMessage message={error} />}
        <input
          type="email"
          name="email"
          placeholder="HTU Email"
          value={formData.email}
          onChange={handleChange}
          className="auth-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          Login
        </button>
        <p className="auth-switch">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
