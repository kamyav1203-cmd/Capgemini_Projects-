import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.fullName, form.email, form.password);
      }
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Authentication failed.');
    }
  };

  const forgotPassword = async () => {
    const { data } = await api.post('/auth/forgot-password', { email: form.email });
    setMessage(`${data.message} Token: ${data.simulatedResetToken}`);
  };

  return (
    <section className="auth-panel">
      <div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="text-secondary">Order fresh meals, track checkout, and manage your history from one place.</p>
      </div>
      <form className="card compact-card" onSubmit={submit}>
        <div className="btn-group mb-3" role="group">
          <button type="button" className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('register')}>Register</button>
        </div>
        {mode === 'register' && (
          <label className="form-label">Full name
            <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </label>
        )}
        <label className="form-label">Email
          <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="form-label">Password
          <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength="6" />
        </label>
        {message && <div className="alert alert-info py-2">{message}</div>}
        <button className="btn btn-success w-100" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        <button className="btn btn-link" type="button" onClick={forgotPassword}>Forgot password</button>
      </form>
    </section>
  );
}
