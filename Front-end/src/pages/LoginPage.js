import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent full page reload
    // Optional: add login validation logic here
    navigate('/home'); // navigate to HomePage
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="Enter your username" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter your password" />
                <div className="text-end mt-1">
                  <a href="#" className="small text-primary text-decoration-none">Forgot password?</a>
                </div>
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>

              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>

            <div className="mt-4 d-flex justify-content-between small">
              <span>Don’t have an account?</span>
              <a href="#">Contact your administrator</a>
            </div>

            <div className="mt-5 text-muted small text-center">
              © 2023 CRR Validation Application. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
