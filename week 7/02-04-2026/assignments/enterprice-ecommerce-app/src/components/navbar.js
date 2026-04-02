import { NavLink } from "react-router-dom";
import "../index.css";

function Navbar() {
  return (
    <div className="navbar">
      <h2>MyStore</h2>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </div>
    </div>
  );
}

export default Navbar;