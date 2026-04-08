/**
 * PAGE: Login
 * ------------
 * PURPOSE: Authentication page — first screen users see.
 *
 * REDUX USAGE:
 * - dispatch(login({email, password})) → triggers auth reducer
 * - dispatch(clearError())             → clears previous error
 * - useSelector(state => state.auth)   → reads error and isAuthenticated
 *
 * FLOW:
 * 1. User enters email + password
 * 2. Clicks Sign In
 * 3. dispatch(clearError()) removes old error
 * 4. dispatch(login({email, password})) sent to authSlice reducer
 * 5. If valid → isAuthenticated becomes true → App.js redirects to /dashboard
 * 6. If invalid → error message shown below password field
 *
 * TEST CREDENTIALS:
 * Admin:    admin@company.com / admin123
 * Employee: emp@company.com   / emp123
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../features/auth/authSlice";

function Login({ theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read error and auth status from Redux store
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  // If login succeeds, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    dispatch(clearError());                   // clear old errors
    dispatch(login({ email, password }));     // attempt login
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: `1px solid ${theme.border}`,
    borderRadius: "8px", background: theme.inputBg,
    color: theme.text, fontSize: "0.95rem",
    outline: "none", marginBottom: "14px",
  };

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: theme.cardBg, border: `1px solid ${theme.border}`,
        borderRadius: "16px", padding: "44px 40px",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🏢</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
            Redux EMS
          </h1>
          <p style={{ color: theme.subtext, fontSize: "0.9rem" }}>
            Employee Management System
          </p>
        </div>

        {/* Email Input */}
        <label style={{ fontSize: "0.85rem", color: theme.subtext, display: "block", marginBottom: "5px" }}>
          Email Address
        </label>
        <input
          style={inputStyle}
          type="email"
          placeholder="admin@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <label style={{ fontSize: "0.85rem", color: theme.subtext, display: "block", marginBottom: "5px" }}>
          Password
        </label>
        <input
          style={inputStyle}
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {/* Error message from Redux state */}
        {error && (
          <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        {/* Login button — dispatches login action */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "12px",
            background: theme.accent, color: "#fff",
            border: "none", borderRadius: "8px",
            fontWeight: "700", fontSize: "1rem", cursor: "pointer",
          }}
        >
          Sign In
        </button>

        {/* Test credentials box */}
        <div style={{
          marginTop: "20px", background: theme.inputBg,
          border: `1px solid ${theme.border}`,
          borderRadius: "8px", padding: "14px",
        }}>
          <p style={{ color: theme.subtext, fontSize: "0.82rem", marginBottom: "6px" }}>
            Test Credentials:
          </p>
          <p style={{ color: theme.text, fontSize: "0.82rem" }}>
            Admin: admin@company.com / admin123
          </p>
          <p style={{ color: theme.text, fontSize: "0.82rem" }}>
            Employee: emp@company.com / emp123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;