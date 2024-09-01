import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext'; // Adjust the path as needed

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>; // Show a loading spinner or message

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
