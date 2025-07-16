import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/Homepage';
import RegisterPage from './pages/RegisterPage';
import NewProjectForm from './Forms/ProjInfo';
import Section1 from './Forms/Section1'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage /> }  />
        <Route path="/new-project" element={<NewProjectForm />} />
        <Route path="/crr-Section1" element={<Section1 />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/edit/:id" element={<NewProjectForm />} />
        <Route path="/projects/:projectId/crrs/:crrId/section1" element={<Section1 />} />
      </Routes>
    </Router>
  );
}

export default App;
