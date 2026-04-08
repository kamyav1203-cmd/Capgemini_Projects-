import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);
  const { loading } = useSelector((state) => state.employees);

  // 🔥 Updated theme (purple + smoother UI)
  const theme = {
    isDark,
    bg:       isDark ? "#020617" : "#f8fafc",
    cardBg:   isDark ? "#0f172a" : "#ffffff",
    text:     isDark ? "#e2e8f0" : "#0f172a",
    subtext:  isDark ? "#94a3b8" : "#64748b",
    border:   isDark ? "#1e293b" : "#e2e8f0",
    navBg:    isDark ? "#020617" : "#ffffff",
    inputBg:  isDark ? "#020617" : "#f1f5f9",
    accent:   "#8b5cf6", // 🔥 main change
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "Poppins, Segoe UI, sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      <BrowserRouter>
        {loading && <LoadingSpinner />}
        {isAuthenticated && <Navbar theme={theme} />}

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login theme={theme} />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard theme={theme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees theme={theme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics theme={theme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings theme={theme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;