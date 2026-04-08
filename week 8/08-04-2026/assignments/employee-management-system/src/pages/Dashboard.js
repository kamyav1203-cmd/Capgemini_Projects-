/**
 * PAGE: Dashboard
 * ----------------
 * PURPOSE: Home page after login. Shows summary stats and quick actions.
 *
 * REDUX USAGE:
 * - useSelector(state => state.auth)      → gets logged in user name/role
 * - useSelector(state => state.employees) → gets employee list for stats
 *
 * DERIVED STATE:
 * Data computed FROM Redux state (not stored separately):
 * - active employees count   → filter list where status === "Active"
 * - department count         → unique departments using Set
 * - average salary           → reduce to sum then divide by length
 *
 * WHY DERIVED STATE?
 * We don't store "activeCount" in Redux — we calculate it from existing data.
 * This keeps Redux state minimal and avoids duplication.
 */

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Dashboard({ theme }) {
  const { user } = useSelector((state) => state.auth);
  const { list: employees } = useSelector((state) => state.employees);
  const navigate = useNavigate();

  // Derived state — calculated from Redux store data
  const active    = employees.filter((e) => e.status === "Active").length;
  const inactive  = employees.filter((e) => e.status === "Inactive").length;
  const depts     = [...new Set(employees.map((e) => e.dept))].length;
  const avgSalary = Math.round(
    employees.reduce((sum, e) => sum + e.salary, 0) / employees.length
  );

  return (
    <div style={{ padding: "32px 28px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Welcome header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "4px" }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: theme.subtext }}>
          Role: {user?.role} · Redux-powered Employee Dashboard
        </p>
      </div>

      {/* Stats cards — data comes from Redux store */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          ["👥", "Total Employees", employees.length, theme.accent],
          ["✅", "Active",          active,            "#22c55e"],
          ["⏸️", "Inactive",        inactive,          "#f59e0b"],
          ["🏢", "Departments",     depts,             "#8b5cf6"],
          ["💰", "Avg Salary",      "₹" + avgSalary.toLocaleString(), "#ef4444"],
        ].map(([icon, label, value, color]) => (
          <div key={label} style={{
            background: theme.cardBg, border: `1px solid ${theme.border}`,
            borderRadius: "12px", padding: "24px", flex: 1,
          }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{icon}</div>
            <div style={{ color: theme.subtext, fontSize: "0.82rem", marginBottom: "4px" }}>
              {label}
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: "800", color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Recent employees from Redux store */}
        <div style={{
          background: theme.cardBg, border: `1px solid ${theme.border}`,
          borderRadius: "12px", padding: "24px",
        }}>
          <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>Recent Employees</h3>
          {employees.slice(0, 4).map((e) => (
            <div key={e.id} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderBottom: `1px solid ${theme.border}`,
              fontSize: "0.9rem",
            }}>
              <div>
                <div style={{ fontWeight: "600" }}>{e.name}</div>
                <div style={{ color: theme.subtext, fontSize: "0.8rem" }}>{e.dept}</div>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: "20px",
                fontSize: "0.78rem", fontWeight: "600",
                background: e.status === "Active" ? "#dcfce7" : "#fef3c7",
                color:      e.status === "Active" ? "#16a34a" : "#d97706",
              }}>
                {e.status}
              </span>
            </div>
          ))}
        </div>

        {/* Quick action buttons */}
        <div style={{
          background: theme.cardBg, border: `1px solid ${theme.border}`,
          borderRadius: "12px", padding: "24px",
        }}>
          <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>Quick Actions</h3>
          {[
            ["➕ Add New Employee", "/employees", theme.accent],
            ["📊 View Analytics",   "/analytics", "#8b5cf6"],
            ["⚙️ Settings",         "/settings",  "#f59e0b"],
          ].map(([label, path, color]) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              style={{
                display: "block", width: "100%", padding: "12px 16px",
                marginBottom: "10px", background: color + "15",
                border: `1px solid ${color}40`, borderRadius: "8px",
                color, fontWeight: "600", cursor: "pointer",
                fontSize: "0.9rem", textAlign: "left",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;