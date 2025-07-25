import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaMoon, FaSignOutAlt, FaLock, FaUserTag } from 'react-icons/fa';
import './Settings.css';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Settings = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: 'Project Manager',
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setApiError(null);
      try {
        // Replace with your authentication mechanism to get user ID or token
        const token = localStorage.getItem('token'); // Example: JWT token
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUser({
          username: data.username,
          email: data.email,
          role: data.role,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setApiError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input changes for profile fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};
    if (!user.username.trim()) newErrors.username = 'Username is required';
    if (!user.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = 'Invalid email format';
    return newErrors;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfileForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setApiError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to change password');
      }
      setSuccessMessage('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setApiError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem('token'); // Clear token
        navigate('/login'); // Redirect to login page
      } catch (error) {
        console.error('Error logging out:', error);
        setApiError('Failed to log out. Please try again.');
      }
    }
  };

  // Apply dark mode to the document
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  if (loading) {
    return (
      <div className="settings-wrapper">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="settings-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '24px 0', background: '#f7f8fa' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', width: '100%', maxWidth: '900px', padding: '0', position: 'relative' }}>
        {/* Left column: Profile and Security */}
        <div style={{ flex: 1, minWidth: '320px', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '100%', border: '2px solid #e3e6ee', borderRadius: '14px', boxShadow: '0 1px 6px rgba(108,99,255,0.07)', padding: '8px 10px', background: '#fff', minHeight: '100px' }}>
            <div className="profile-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '6px' }}>
              <FaUserCircle className="profile-icon" aria-label="User profile" style={{ fontSize: '2.7rem', color: '#6c63ff', marginBottom: '6px' }} />
              <h2 style={{ fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>{user.username || 'User'}</h2>
              <p style={{ color: '#888', margin: '2px 0 0 0', fontSize: '0.95rem' }}>{user.email || 'No email'}</p>
              <span className="user-role" style={{ marginTop: '6px', color: '#6c63ff', fontWeight: 500, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaUserTag /> {user.role}
              </span>
          </div>
            {apiError && <div className="alert error">{apiError}</div>}
            {successMessage && <div className="alert success">{successMessage}</div>}
            <form onSubmit={handleProfileUpdate} className="section" style={{ marginTop: '8px' }}>
              <h3 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px', color: '#333' }}>Profile</h3>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="username" style={{ fontWeight: 500, marginBottom: '4px', display: 'block' }}>Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e3e6ee', fontSize: '1rem' }}
                />
                {errors.username && (
                  <span id="username-error" className="error-text" style={{ color: '#d32f2f', fontSize: '0.95rem' }}>
                    {errors.username}
                  </span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="email" style={{ fontWeight: 500, marginBottom: '4px', display: 'block' }}>Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e3e6ee', fontSize: '1rem' }}
                />
                {errors.email && (
                  <span id="email-error" className="error-text" style={{ color: '#d32f2f', fontSize: '0.95rem' }}>
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label htmlFor="role" style={{ fontWeight: 500, marginBottom: '4px', display: 'block' }}>Role</label>
                <select
                  id="role"
                  name="role"
                  value={user.role}
                  onChange={handleInputChange}
                  disabled // Disable if role changes are restricted
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e3e6ee', fontSize: '1rem', background: '#f7f8fa' }}
                >
                  <option value="Project Manager">Project Manager</option>
                  <option value="Constructor Manager">Constructor Manager</option>
                </select>
              </div>
              <button type="submit" className="save-btn" disabled={loading} style={{ width: '100%', padding: '8px 0', borderRadius: '6px', background: '#6c63ff', color: '#fff', fontWeight: 600, fontSize: '0.95rem', border: 'none', boxShadow: '0 2px 8px rgba(108,99,255,0.08)' }}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '320px', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '100%', border: '2px solid #e3e6ee', borderRadius: '14px', boxShadow: '0 1px 6px rgba(108,99,255,0.07)', padding: '12px 12px', background: '#fff' }}>
            <form onSubmit={handlePasswordUpdate} className="section" style={{ width: '100%' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px', color: '#333', textAlign: 'center' }}>Security</h3>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="currentPassword" style={{ fontWeight: 500, marginBottom: '4px', display: 'block' }}>Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  aria-invalid={!!errors.currentPassword}
                  aria-describedby={errors.currentPassword ? 'currentPassword-error' : undefined}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e3e6ee', fontSize: '1rem' }}
                />
                {errors.currentPassword && (
                  <span id="currentPassword-error" className="error-text" style={{ color: '#d32f2f', fontSize: '0.95rem' }}>
                    {errors.currentPassword}
                  </span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="newPassword" style={{ fontWeight: 500, marginBottom: '4px', display: 'block' }}>New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  aria-invalid={!!errors.newPassword}
                  aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e3e6ee', fontSize: '1rem' }}
                />
                {errors.newPassword && (
                  <span id="newPassword-error" className="error-text" style={{ color: '#d32f2f', fontSize: '0.95rem' }}>
                    {errors.newPassword}
                  </span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label htmlFor="confirmNewPassword" style={{ fontWeight: 500, marginBottom: '4px', display: 'block' }}>Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  aria-invalid={!!errors.confirmNewPassword}
                  aria-describedby={errors.confirmNewPassword ? 'confirmNewPassword-error' : undefined}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e3e6ee', fontSize: '1rem' }}
                />
                {errors.confirmNewPassword && (
                  <span id="confirmNewPassword-error" className="error-text" style={{ color: '#d32f2f', fontSize: '0.95rem' }}>
                    {errors.confirmNewPassword}
                  </span>
                )}
              </div>
              <button type="submit" className="save-btn" disabled={loading} style={{ width: '100%', padding: '8px 0', borderRadius: '6px', background: '#6c63ff', color: '#fff', fontWeight: 600, fontSize: '0.95rem', border: 'none', boxShadow: '0 2px 8px rgba(108,99,255,0.08)' }}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
          <div className="section danger" style={{ marginTop: '32px', width: '100%', border: '2px solid #d32f2f', borderRadius: '14px', boxShadow: '0 1px 6px rgba(211,47,47,0.07)', padding: '10px 12px', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ color: '#d32f2f', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>Danger Zone</h3>
            <button className="logout-btn" onClick={handleLogout} disabled={loading} style={{ width: '100%', padding: '8px 0', borderRadius: '6px', background: '#d32f2f', color: '#fff', fontWeight: 600, fontSize: '0.95rem', border: 'none', boxShadow: '0 2px 8px rgba(211,47,47,0.08)' }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;