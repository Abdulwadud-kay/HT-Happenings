import React, { useState } from "react";
import "./AuthStyles.css"; 
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth, firestore } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";

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
  const navigate = useNavigate();

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

    try {
      // Correct usage of createUserWithEmailAndPassword in Firebase v9
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      // Create a user document in Firestore
      await setDoc(doc(collection(firestore, "users"), userId), {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        fullName: formData.fullName,
      });

      setSuccess("SignUp successful!");
      navigate('/Login');
      setError("");
      
      // Optionally, navigate to another page, e.g., navigate('/home');
    } catch (error) {
      setError("Error creating user: " + error.message);
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
