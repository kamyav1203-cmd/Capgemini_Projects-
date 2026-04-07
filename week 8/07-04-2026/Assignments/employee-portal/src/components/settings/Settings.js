import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Moon, Sun, User, Mail, Shield } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="settings">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>User Profile</h2>
        <div className="settings-card">
          <div className="setting-item">
            <User size={20} />
            <div>
              <p className="setting-label">Name</p>
              <p className="setting-value">{user?.name}</p>
            </div>
          </div>
          <div className="setting-item">
            <Mail size={20} />
            <div>
              <p className="setting-label">Username</p>
              <p className="setting-value">{user?.username}</p>
            </div>
          </div>
          <div className="setting-item">
            <Shield size={20} />
            <div>
              <p className="setting-label">Role</p>
              <p className="setting-value">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-card">
          <div className="setting-item">
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            <div>
              <p className="setting-label">Theme</p>
              <p className="setting-value">Current: {theme === 'light' ? 'Light' : 'Dark'}</p>
            </div>
            <button onClick={toggleTheme} className="btn btn-secondary">
              Switch to {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;