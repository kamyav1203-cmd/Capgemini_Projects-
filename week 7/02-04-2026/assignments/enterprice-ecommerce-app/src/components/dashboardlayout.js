import { Outlet, NavLink } from "react-router-dom";
import "../index.css";

function DashboardLayout() {
  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>

        <div>
          <NavLink to="/dashboard" className="btn">Home</NavLink>
          <NavLink to="analytics" className="btn">Analytics</NavLink>
          <NavLink to="settings" className="btn">Settings</NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default DashboardLayout;