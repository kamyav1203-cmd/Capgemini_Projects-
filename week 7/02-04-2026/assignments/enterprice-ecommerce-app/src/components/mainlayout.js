import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import "../index.css";

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
      <div className="footer">© 2026 MyStore</div>
    </>
  );
}

export default MainLayout;