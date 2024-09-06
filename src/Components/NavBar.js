import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase setup
import ProfileMiniView from './ProfileMiniView'; // Import the ProfileMiniView component
import './NavBar.css'; // CSS file for styling the navbar
import { FaUserCircle } from 'react-icons/fa'; // Importing the profile icon from react-icons

const NavBar = () => {
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">HTU Campus Events</h1>
      <ul className="navbar-links">
        {/* <div className="allign" > */}
        <li>
          <Link to="/home" className="navbar-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/eventcreate" className="navbar-link">
            Create Event
          </Link>
        </li>
        <li>
          <Link to="/myevents" className="navbar-link">
            My Events
          </Link>
        </li>
        <li>
          <div
            className="profile-icon-main"
            onClick={() => setShowProfile((prev) => !prev)} // Toggle profile view
          >
            <FaUserCircle size={30} className="navbar-profile-icon" /> {/* Profile icon */}
          </div>
          {showProfile && <ProfileMiniView onLogout={handleLogout} />}
        </li>
        {/* </div> */}
      </ul>
    </nav>
  );
};

export default NavBar;
