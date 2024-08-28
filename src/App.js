// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from "./Components/LogIn";
import NavBar from "./Components/NavBar";
import HomePage from "./Components/Home";
import Questionnaire from "./Components/Questionaire";
import EventDraft from './Components/EventDraft';
import EventDetail from './Components/EventDetail';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer, toast } from 'react-toastify';


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/eventdraft" element={<EventDraft />} />
          <Route path="/eventdetail" element={<EventDetail />} />
          <Route path="/questionaire" element={<Questionnaire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<SignUp />} /> {/* Default route to SignUp */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
