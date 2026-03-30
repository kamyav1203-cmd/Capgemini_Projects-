import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ FIXED

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);