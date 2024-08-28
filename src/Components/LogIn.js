// src/Components/LogIn.js
import React, { useState } from "react";
import "./AuthStyles.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Adjust the path if necessary
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

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

    // Check if either the email or password field is empty
    if (formData.email === "" || formData.password === "") {
      setError("Please input both email and password");
      return;
    }

    // Sign in then navigate to the homepage
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setError(""); // Clear any previous error
      navigate("/Questionaire"); // Navigate to the home page
    } catch (error) {
      setError(error.message); // Display error message
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleSignIn} className="auth-form">
        {error && <p className="auth-error">{error}</p>} {/* Display error messages */}
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
