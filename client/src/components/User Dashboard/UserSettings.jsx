import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { auth } from '../firebase/config';
import { 
  updatePassword, 
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import './UserSettings.css';

function UserSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: '', width: 0 });
  
  // Form data
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Handle not logged in state
        window.location.href = '/signin';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check password strength
  useEffect(() => {
    if (!formData.newPassword) {
      setPasswordStrength({ level: '', width: 0 });
      return;
    }

    // Simple password strength calculation
    const hasLowerCase = /[a-z]/.test(formData.newPassword);
    const hasUpperCase = /[A-Z]/.test(formData.newPassword);
    const hasNumbers = /\d/.test(formData.newPassword);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
    const isLongEnough = formData.newPassword.length >= 8;
    
    const criteriaCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars, isLongEnough].filter(Boolean).length;
    
    if (criteriaCount <= 2) {
      setPasswordStrength({ level: 'weak', width: 33 });
    } else if (criteriaCount <= 4) {
      setPasswordStrength({ level: 'medium', width: 66 });
    } else {
      setPasswordStrength({ level: 'strong', width: 100 });
    }
  }, [formData.newPassword]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Re-authenticate user (required for sensitive operations)
  const reauthenticate = async () => {
    if (!currentPasswordInput) {
      setMessage({ type: 'danger', text: 'Current password is required' });
      return false;
    }
    
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPasswordInput
      );
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: 'Authentication failed. Please check your current password.' 
      });
      return false;
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: '', text: '' });
    
    // Validate password match
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      setUpdateLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength.level === 'weak') {
      setMessage({ 
        type: 'warning', 
        text: 'Please choose a stronger password with a mix of uppercase, lowercase, numbers, and special characters.' 
      });
      setUpdateLoading(false);
      return;
    }
    
    // First reauthenticate
    const isAuthenticated = await reauthenticate();
    if (!isAuthenticated) {
      setUpdateLoading(false);
      return;
    }
    
    try {
      await updatePassword(user, formData.newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setEditing(false);
      setCurrentPasswordInput('');
      setFormData({
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'danger', text: `Error updating password: ${error.message}` });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Toggle editing state for password
  const toggleEditing = () => {
    setEditing(!editing);
    setMessage({ type: '', text: '' });
    setFormData({
      newPassword: '',
      confirmNewPassword: ''
    });
    setCurrentPasswordInput('');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(false);
    setFormData({
      newPassword: '',
      confirmNewPassword: ''
    });
    setCurrentPasswordInput('');
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <Container className="settings-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" style={{ color: 'var(--primary)' }} />
      </Container>
    );
  }

  return (
    <Container className="settings-container">
      {/* <h2 className="settings-title">Account Settings</h2> */}
      
      {message.text && (
        <Alert variant={message.type} className="settings-alert">
          {message.text}
        </Alert>
      )}
      
      <div className="settings-card">
        <h3 className="section-title">Profile Information</h3>
        <div className="profile-section">
          <div className="profile-image-container">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <Form>
              <Form.Group className="mb-3">
                <div className="field-info">
                  <Form.Label>Display Name</Form.Label>
                  <span className="field-help">How you appear to others</span>
                </div>
                <Form.Control
                  type="text"
                  value={user.displayName || ''}
                  disabled
                  readOnly
                />
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <h3 className="section-title">Email Address</h3>
        <div className="p-4">
          <Form.Group className="mb-0">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={user.email || ''}
              disabled
              readOnly
            />
          </Form.Group>
        </div>
      </div>
      
      <div className="settings-card">
        <h3 className="section-title">Password</h3>
        <div className="password-section">
          {!editing ? (
            <div className="password-header">
              <div>
                <div className="password-placeholder">••••••••</div>
                {/* <small className="text-muted">Last changed: Never</small> */}
              </div>
              <Button 
                variant="outline-primary" 
                onClick={toggleEditing}
              >
                Change Password
              </Button>
            </div>
          ) : (
            <Form onSubmit={handlePasswordUpdate} className="password-form">
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
                {formData.newPassword && (
                  <>
                    <div className="password-strength">
                      <div className={`password-strength-bar strength-${passwordStrength.level}`}></div>
                    </div>
                    {passwordStrength.level && (
                      <div className={`strength-text text-${passwordStrength.level}`}>
                        Password strength: {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                      </div>
                    )}
                  </>
                )}
                <Form.Text>
                  Password should be at least 8 characters with uppercase, lowercase, numbers and special characters.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
                {formData.newPassword && formData.confirmNewPassword && 
                  formData.newPassword !== formData.confirmNewPassword && (
                    <Form.Text className="text-danger">
                      Passwords do not match
                    </Form.Text>
                  )}
              </Form.Group>
              
              <div className="form-actions">
                <Button 
                  variant="outline-secondary" 
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Updating...</span>
                    </>
                  ) : 'Update Password'}
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </Container>
  );
}

export default UserSettings;