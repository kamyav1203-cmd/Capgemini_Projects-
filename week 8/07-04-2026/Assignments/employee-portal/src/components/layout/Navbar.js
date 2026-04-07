import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { LogOut, Moon, Sun, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Employee Portal</h2>
      </div>

      <div className="navbar-actions">
        <button onClick={toggleTheme} className="btn btn-icon" title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="user-info">
          <User size={20} />
          <span>{user?.name || 'User'}</span>
        </div>

        <button onClick={logout} className="btn btn-secondary" title="Logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;