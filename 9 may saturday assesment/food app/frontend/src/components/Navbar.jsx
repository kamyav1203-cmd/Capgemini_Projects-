import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">FoodOrder</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/">Home</NavLink>
            {isAuthenticated && <NavLink className="nav-link" to="/cart">Cart</NavLink>}
            {isAuthenticated && <NavLink className="nav-link" to="/orders">Orders</NavLink>}
            {isAdmin && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
          </div>
          <div className="d-flex align-items-center gap-3">
            {user && <span className="small text-secondary">{user.fullName}</span>}
            {isAuthenticated ? (
              <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>Logout</button>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
