import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/LogIn';
import NavBar from './Components/NavBar';
import HomePage from './Components/Home';
import Questionnaire from './Components/Questionaire';
import EventDraft from './Components/EventDraft';
import EventDetail from './Components/EventDetail';
import EventCreate from './Components/EventCreate';
import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

const AppLayout = () => {
  const location = useLocation(); // Get current location

  // Function to get the page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/questionaire":
        return "Questionnaire";
      default:
        return "";
    }
  };

  return (
    <div className="App">
      {location.pathname === "/home" ? (
        <NavBar /> // Show NavBar only on the home page
      ) : (
        <h1 className="page-title">{getPageTitle()}</h1> // Show the page name on other pages
      )}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignUp />} /> {/* Default route to SignUp */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventdraft"
          element={
            <ProtectedRoute>
              <EventDraft />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventdetail/:id" // Updated route to include event ID
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questionaire"
          element={
            <ProtectedRoute>
              <Questionnaire />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventcreate"
          element={
            <ProtectedRoute>
              <EventCreate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;