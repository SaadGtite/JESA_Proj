import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewProjectForm from './Forms/ProjInfo';
import Section1 from './Forms/Section1';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar'; // Import Topbar

// Wrapper component to combine Topbar and Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Topbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <MainLayout>
              <Sidebar />
            </MainLayout>
          }
        />
        <Route
          path="/home/projects"
          element={
            <MainLayout>
              <Sidebar />
            </MainLayout>
          }
        />
        <Route
          path="/home/settings"
          element={
            <MainLayout>
              <Sidebar />
            </MainLayout>
          }
        />
        <Route path="/new-project" element={<NewProjectForm />} />
        <Route path="/crr-Section1" element={<Section1 />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/edit/:id" element={<NewProjectForm />} />
        <Route path="/:projectId/crrs/:crrId" element={<Section1 />} />
      </Routes>
    </Router>
  );
}

export default App;