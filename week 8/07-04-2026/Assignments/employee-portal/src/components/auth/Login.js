import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(credentials.username, credentials.password);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <LogIn size={48} className="login-icon" />
          <h1>Employee Portal</h1>
          <p>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>
              <User size={20} />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={20} />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>User: user / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;