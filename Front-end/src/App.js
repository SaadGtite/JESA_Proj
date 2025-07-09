import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/Homepage';
import NewProjectForm from './Forms/ProjInfo';
import Section1 from './Forms/Section1'; // Assuming Section1.js is in the Forms directory


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage /> }  />
        <Route path="/new-project" element={<NewProjectForm />} />
        <Route path="/crr-Section1" element={<Section1 />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
