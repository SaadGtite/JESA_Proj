import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import './App.css'; // Import global styles

function App() {
  return (
    <div className="app">
      <Topbar />
      <div className="content-layout">
        <Sidebar />
        <Dashboard /> {/* <-- this must be visible here */}
      </div>
    </div>
  );
}

export default App;
