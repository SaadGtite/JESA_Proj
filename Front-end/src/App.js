import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewProjectForm from './Forms/ProjInfo';
import Section1 from './Forms/Section1';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Sidebar from './components/Sidebar';
import EditProjectForm from './Forms/EditProjectForm';
import Topbar from './components/Topbar'; // Import Topbar
import Section2 from './Forms/Section2';
import Section3 from './Forms/Section3';
import Section4 from './Forms/Section4'; // Import Section4
import Analytics from './pages/analytics'; // Import Analytics
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
        <Route path="/projinfo/:id" element={<EditProjectForm />} />
        <Route path="/:projectId/crrs/:crrId" element={<Section1 />} />
        <Route path="/projects/:projectId/crrs/:crrId" element={<Section2 />} />
        <Route path="/projects/:projectId/crrs/:crrId/section3" element={<Section3 />} />
        <Route path="/projects/:projectId/crrs/:crrId/section4" element={<Section4 />} /> {/* Added route for Section4 */}
        <Route path="/projects/:projectId/crrs/:crrId/analytics" element={<Analytics />} /> {/* Added route for Analytics */}
      </Routes>
    </Router>
  );
}

export default App;