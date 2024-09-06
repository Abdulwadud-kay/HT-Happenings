import React, { useRef, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage, firestore } from '../firebase'; // Import your Firebase setup and storage
import './ProfileMiniView.css'; // CSS file for styling the profile mini-view
import { FaUserCircle } from 'react-icons/fa'; // Importing the profile icon from react-icons
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage functions
import { updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const ProfileMiniView = ({ onLogout }) => {
  const [user] = useAuthState(auth);
  const fileInputRef = useRef(null);
  const [profilePicUrl, setProfilePicUrl] = useState(user?.photoURL);


  // Define a variable for user.photoURL
  const userPhotoURL = user?.photoURL;
  const [displayName, setDisplayName] = useState('User Name');


  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = doc(firestore, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setDisplayName(userData.email || 'User Name'); // Set the display name or default value
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
    // Update profilePicUrl when user photoURL changes
    setProfilePicUrl(userPhotoURL);
  }, [userPhotoURL]);

  const handleProfilePicClick = () => {
    fileInputRef.current.click(); // Trigger file input click when profile icon is clicked
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      console.log('File selected:', file);
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      console.log('Uploading file to:', storageRef.fullPath);
      await uploadBytes(storageRef, file);
      console.log('File upload successful');

      const photoURL = await getDownloadURL(storageRef);
      console.log('Download URL:', photoURL);

      // Update the user's profile picture in Firebase Auth
      await updateProfile(user, { photoURL });
      console.log('Profile updated with new photoURL:', photoURL);

      // Update the profile picture URL in the state
      setProfilePicUrl(photoURL);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div className="profile-mini-view">
      {profilePicUrl ? (
        <img
          src={profilePicUrl}
          alt="Profile"
          className="profile-pic"
          onClick={handleProfilePicClick} // Click to update picture
        />
      ) : (
        <FaUserCircle
          className="profile-icon"
          size={40}
          onClick={handleProfilePicClick} // Click to update picture
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <p className="profile-name">{displayName}</p> {/* Display user’s displayName */}
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default ProfileMiniView;
