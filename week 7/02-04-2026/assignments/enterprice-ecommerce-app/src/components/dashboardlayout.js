import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../index.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/auth/login");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>

        <div>
          <NavLink to="/dashboard" className="btn">Home</NavLink>
          <NavLink to="analytics" className="btn">Analytics</NavLink>
          <NavLink to="settings" className="btn">Settings</NavLink>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default DashboardLayout;