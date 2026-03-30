import React, { useState } from "react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDark ? "#222" : "#fff",
    color: isDark ? "#fff" : "#000",
    transition: "0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <h2>Mode: {isDark ? "Dark" : "Light"}</h2>

      <button onClick={toggleTheme}>
        {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </div>
  );
}

export default ThemeToggle;