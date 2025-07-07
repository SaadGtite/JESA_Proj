import React from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app">
      <Topbar />
      <div className="content-layout">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
