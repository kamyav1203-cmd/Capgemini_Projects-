import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, username: 'user', password: 'user123', role: 'employee', name: 'John Doe' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};