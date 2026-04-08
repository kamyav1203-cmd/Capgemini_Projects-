/**
 * PAGE: Settings
 * ---------------
 * PURPOSE: User preferences and Redux store information.
 *
 * REDUX USAGE:
 * - useSelector(state => state.auth)      → user profile info
 * - useSelector(state => state.theme)     → current theme (isDark)
 * - useSelector(state => state.employees) → employee count for store info
 * - dispatch(toggleTheme())              → switches dark/light mode
 *
 * TOGGLE COMPONENT:
 * A reusable toggle switch built with plain CSS.
 * val prop controls position of the white circle.
 */

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

function Settings({ theme }) {
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);
  const { list: employees } = useSelector((state) => state.employees);

  /**
   * Toggle Switch Component
   * Animated on/off toggle — position changes based on val prop.
   */
  const Toggle = ({ val, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        width: "46px", height: "26px", borderRadius: "13px",
        background: val ? theme.accent : theme.border,
        position: "relative", cursor: "pointer",
        transition: "background 0.3s",
      }}
    >
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        background: "#fff", position: "absolute", top: "3px",
        left: val ? "23px" : "3px",
        transition: "left 0.3s",
      }} />
    </div>
  );

  // Reusable row layout for settings items
  const Row = ({ label, content }) => (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "16px 0",
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <span style={{ fontWeight: "500" }}>{label}</span>
      <span>{content}</span>
    </div>
  );

  return (
    <div style={{ padding: "32px 28px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "4px" }}>Settings</h1>
      <p style={{ color: theme.subtext, marginBottom: "28px" }}>Manage your preferences</p>

      {/* Profile section — data from Redux auth state */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px" }}>👤 Profile</h3>
        <Row label="Name"  content={<strong>{user?.name}</strong>} />
        <Row label="Email" content={<span style={{ color: theme.subtext }}>{user?.email}</span>} />
        <Row label="Role"  content={
          <span style={{ background: theme.accent + "20", color: theme.accent, padding: "3px 12px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "600" }}>
            {user?.role}
          </span>
        } />
      </div>

      {/* Appearance section — dispatches toggleTheme to Redux */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px" }}>🎨 Appearance</h3>
        <Row
          label="Dark Mode"
          content={<Toggle val={isDark} onToggle={() => dispatch(toggleTheme())} />}
        />
        <Row
          label="Current Theme"
          content={<span style={{ color: theme.subtext }}>{isDark ? "🌙 Dark" : "☀️ Light"}</span>}
        />
      </div>

      {/* Redux store info section */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>🗃️ Redux Store Info</h3>
        <Row label="State Management" content={<span style={{ color: theme.subtext }}>Redux Toolkit (createSlice)</span>} />
        <Row label="Total Slices"     content={<span style={{ color: theme.subtext }}>3 (auth, employees, theme)</span>} />
        <Row label="Middleware"        content={<span style={{ color: theme.subtext }}>Logger + Redux Default</span>} />
        <Row label="Persistence"       content={<span style={{ color: "#22c55e", fontWeight: "600" }}>✅ localStorage</span>} />
        <Row label="Employees in Store" content={<span style={{ color: theme.accent, fontWeight: "700" }}>{employees.length}</span>} />
      </div>
    </div>
  );
}

export default Settings;