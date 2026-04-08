/**
 * COMPONENT: ProtectedRoute
 * --------------------------
 * PURPOSE: Guards routes that require authentication.
 * If user is NOT logged in → redirect to /login page.
 * If user IS logged in     → show the requested page.
 *
 * HOW IT WORKS:
 * - Reads isAuthenticated from Redux auth state
 * - Wraps protected pages in App.js
 * - If not authenticated, Navigate component redirects to login
 *
 * USAGE in App.js:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute><Dashboard /></ProtectedRoute>
 * } />
 */

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  // Read authentication status from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected page
  return children;
}

export default ProtectedRoute;