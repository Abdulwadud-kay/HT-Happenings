// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // CSS file for styling the navbar

const NavBar = () => {
  return (
    
    <nav className="navbar">
      <h1 className="navbar-title">HTU Campus Events</h1>
      <ul className="navbar-links">
        <li>
          <Link to="/signup" className="navbar-link">
            Sign Up
          </Link>
        </li>
        <li>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
