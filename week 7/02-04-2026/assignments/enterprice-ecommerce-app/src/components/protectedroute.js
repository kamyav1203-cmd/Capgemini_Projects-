import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isAuth = localStorage.getItem("isAuth") === "true";
  return isAuth ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default ProtectedRoute;