/**
 * PAGE: Analytics
 * ----------------
 * PURPOSE: Visual data analysis of employee records from Redux store.
 *
 * REDUX USAGE:
 * - useSelector(state => state.employees) → reads employee list
 *
 * ALL DATA IS DERIVED FROM REDUX STATE:
 * - deptCount   → count employees per department using reduce()
 * - totalSalary → sum all salaries using reduce()
 * - maxSalary   → find highest salary using Math.max()
 *
 * BAR CHARTS:
 * Simple CSS width-based bars — width % calculated from data.
 * No external chart library needed.
 */

import { useSelector } from "react-redux";

function Analytics({ theme }) {
  // Read employee list from Redux store
  const { list: employees } = useSelector((state) => state.employees);

  // Count employees per department using reduce
  const deptCount = employees.reduce((acc, e) => {
    acc[e.dept] = (acc[e.dept] || 0) + 1;
    return acc;
  }, {});

  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
  const maxSalary   = Math.max(...employees.map((e) => e.salary));

  return (
    <div style={{ padding: "32px 28px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "4px" }}>Analytics</h1>
      <p style={{ color: theme.subtext, marginBottom: "28px" }}>
        Live data derived from Redux store
      </p>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          ["💵", "Total Payroll",    "₹" + totalSalary.toLocaleString(), "#3b82f6"],
          ["🏆", "Highest Salary",   "₹" + maxSalary.toLocaleString(),   "#22c55e"],
          ["🏢", "Departments",      Object.keys(deptCount).length,       "#8b5cf6"],
          ["👥", "Total Employees",  employees.length,                    "#f59e0b"],
        ].map(([icon, label, value, color]) => (
          <div key={label} style={{
            background: theme.cardBg, border: `1px solid ${theme.border}`,
            borderRadius: "12px", padding: "22px", flex: 1,
          }}>
            <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{icon}</div>
            <div style={{ color: theme.subtext, fontSize: "0.8rem" }}>{label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Department bar chart */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ marginBottom: "20px" }}>Employees by Department</h3>
          {Object.entries(deptCount).map(([dept, count]) => (
            <div key={dept} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "0.9rem" }}>
                <span>{dept}</span>
                <span style={{ color: theme.subtext }}>{count} employees</span>
              </div>
              {/* Bar width = (count / total) * 100% */}
              <div style={{ background: theme.border, borderRadius: "4px", height: "8px" }}>
                <div style={{
                  background: theme.accent, height: "8px", borderRadius: "4px",
                  width: `${(count / employees.length) * 100}%`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Salary distribution bar chart */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ marginBottom: "20px" }}>Salary Distribution</h3>
          {employees.map((e) => (
            <div key={e.id} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "0.9rem" }}>
                <span>{e.name}</span>
                <span style={{ color: theme.accent }}>₹{e.salary.toLocaleString()}</span>
              </div>
              {/* Bar width = (salary / maxSalary) * 100% */}
              <div style={{ background: theme.border, borderRadius: "4px", height: "8px" }}>
                <div style={{
                  background: "#8b5cf6", height: "8px", borderRadius: "4px",
                  width: `${(e.salary / maxSalary) * 100}%`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;