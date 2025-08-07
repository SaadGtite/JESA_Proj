import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css'; // optional for styling

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
         setMessage(`Temporary password: ${data.tempPassword}. Please note it down! Redirecting to login...`);
             setTimeout(() => {
             navigate('/');
             }, 10000);
      } else {
        setMessage(data.message || 'Error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(' please try again later.');
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Temporary Password</button>
        </form>
        {message && <p className="message">{message}</p>}
        <div className="small-text">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
