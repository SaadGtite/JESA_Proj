import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './LoginPage.css';
import logo from '../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
      
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        navigate('/home');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong, please try again.');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-block login-bg" />

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-75">
            <div className="d-flex align-items-center mb-4">
              <img
                src={logo}
                alt="Shield"
                style={{ width: '24px', marginRight: '8px' }}
              />
              <strong>CRR Validation Application</strong>
            </div>

            <h4 className="mb-1">Welcome back</h4>
            <p className="mb-4 text-muted">Please enter your credentials to access your account</p>

            {message && <div className="message">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-end mt-1">
                  <a href="/forgot-password" className="small text-primary text-decoration-none">Forgot password?</a>
                </div>
              </div>

              

              <button type="submit" className="btn btn-primary w-100 ">Login</button>
            </form>

            <div className="mt-4 d-flex justify-content-between small">
              <Link to="/register">Don’t have an account?</Link>
            </div>

            <div className="mt-5 text-muted small text-center">
              © 2023 CRR Validation Application. All rights reserved.
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
