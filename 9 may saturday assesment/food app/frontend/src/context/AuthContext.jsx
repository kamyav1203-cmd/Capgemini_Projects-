import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
  };

  const register = async (fullName, email, password) => {
    const { data } = await api.post('/auth/register', { fullName, email, password });
    persist(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  const persist = (data) => {
    const user = { email: data.email, fullName: data.fullName, roles: data.roles };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token: data.token, user });
  };

  const value = useMemo(() => ({
    auth,
    user: auth?.user,
    isAdmin: auth?.user?.roles?.includes('Admin') ?? false,
    isAuthenticated: Boolean(auth?.token),
    login,
    register,
    logout
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
