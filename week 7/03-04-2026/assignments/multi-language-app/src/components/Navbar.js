import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

function Navbar() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <nav className="navbar">
      <h2 className="logo">🌍 LangApp</h2>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="dropdown"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
      </select>
    </nav>
  );
}

export default Navbar;