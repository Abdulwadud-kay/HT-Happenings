import React, { useState } from "react";
import "./AuthStyles.css"; 
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; 
import { auth, firestore } from "../firebase"; 
import { collection, doc, setDoc } from "firebase/firestore";
import ErrorMessage from './ErrorMessage';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Create a user document in Firestore
      await setDoc(doc(collection(firestore, "users"), user.uid), {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        fullName: formData.fullName,
        emailVerified: false
      });

      setSuccess("SignUp successful! Please check your email to verify your account.");
      setError("");
    } catch (error) {
      let userFriendlyError = "An error occurred. Please try again.";
      
      if (error.code === "auth/weak-password") {
        userFriendlyError = "Password is too short. Please use at least 6 characters.";
      } else if (error.code === "auth/email-already-in-use") {
        userFriendlyError = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.code === "auth/invalid-email") {
        userFriendlyError = "Please enter a valid email address.";
      }
      
      setError(userFriendlyError);
      setSuccess("");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <ErrorMessage message={error} />}
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
