import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";

function Navbar({ theme }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkStyle = (isActive) => ({
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: isActive ? "bold" : "normal",
    background: isActive ? theme.accent : "transparent",
    color: isActive ? "#fff" : theme.subtext,
    textDecoration: "none",
    transition: "all 0.2s",
  });

  return (
    <nav
      style={{
        background: theme.navBg,
        borderBottom: `1px solid ${theme.border}`,
        padding: "12px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {/* 🔥 Updated Branding */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1.3rem" }}>🚀</span>
        <span
          style={{
            fontWeight: "800",
            fontSize: "1.1rem",
            color: theme.accent,
          }}
        >
          StaffFlow
        </span>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {[
          ["Dashboard", "/dashboard"],
          ["Team", "/employees"], // 🔥 renamed
          ["Analytics", "/analytics"],
          ["Settings", "/settings"],
        ].map(([label, path]) => (
          <NavLink key={path} to={path} style={({ isActive }) => linkStyle(isActive)}>
            {label}
          </NavLink>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            background: theme.inputBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            padding: "7px 14px",
            cursor: "pointer",
            color: theme.text,
            fontSize: "0.85rem",
          }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: theme.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: theme.subtext }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "7px 14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Sign Out {/* 🔥 changed */}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;