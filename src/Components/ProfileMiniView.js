import React, { useRef, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage, firestore } from '../firebase';
import './ProfileMiniView.css';
import { FaUserCircle } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import ErrorMessage from './ErrorMessage';

const ProfileMiniView = ({ onLogout }) => {
  const [user] = useAuthState(auth);
  const fileInputRef = useRef(null);
  const [profilePicUrl, setProfilePicUrl] = useState(user?.photoURL);
  const userPhotoURL = user?.photoURL;
  const [displayName, setDisplayName] = useState('User Name');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = doc(firestore, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setDisplayName(userData.email || 'User Name');
          } else {
            console.error('User not found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    setProfilePicUrl(userPhotoURL);
  }, [userPhotoURL]);

  const handleProfilePicClick = () => {
    fileInputRef.current.click(); // Trigger file input click when profile icon is clicked
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });

      setProfilePicUrl(photoURL);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      onLogout(); // Execute the passed logout function
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      alert("Please enter your password to confirm account deletion.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user document from Firestore
      await deleteDoc(doc(firestore, 'users', user.uid));

      // Delete user account
      await deleteUser(user);

      alert("Your account has been deleted.");
      onLogout(); // Redirect to login or home page
    } catch (error) {
      console.error('Error deleting account:', error);
      setError("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="profile-mini-view">
      {profilePicUrl ? (
        <img
          src={profilePicUrl}
          alt="Profile"
          className="profile-pic"
          onClick={handleProfilePicClick}
        />
      ) : (
        <FaUserCircle
          className="profile-icon"
          size={40}
          onClick={handleProfilePicClick}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <p className="profile-name">{displayName}</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <button onClick={() => setShowDeleteConfirm(true)} className="delete-account-button">Delete Account</button>
      
      {showDeleteConfirm && (
        <div className="delete-confirm">
          <input
            type="password"
            placeholder="Enter password to confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleDeleteAccount}>Confirm Delete</button>
          <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
        </div>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ProfileMiniView;
