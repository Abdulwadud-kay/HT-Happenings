import React, { useState } from "react";
import "./AuthStyles.css"; // Import a shared CSS file for styles
import { createUserWithEmailAndPassword } from "firebase/auth"; // Correct import
import { auth } from "../firebase"; // Adjust the path as per your project structure
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Using useNavigate hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validations
    if (!formData.email.endsWith("@htu.edu")) {
      setError("Email must end with @htu.edu");
      setSuccess("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    if (Object.values(formData).some((field) => field === "")) {
      setError("All fields are required");
      setSuccess("");
      return;
    }

    // Create user with email and password
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // If sign-up is successful
      setSuccess("Sign Up Successful, Please login");
      setError("");
      navigate("/"); // Navigates the user to the login page
    } catch (error) {
      // Display error message if sign-up fails
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>} {/* Display error message */}
        {success && <p className="auth-success">{success}</p>} {/* Display success message */}
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
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="auth-input"
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          Sign Up
        </button>
        <p className="auth-switch">
          Already signed up? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
