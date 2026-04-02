import { Navigate, Outlet } from "react-router-dom";

const isAuth = true;

function ProtectedRoute() {
  return isAuth ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default ProtectedRoute;