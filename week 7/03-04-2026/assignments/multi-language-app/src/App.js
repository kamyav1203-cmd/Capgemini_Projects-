import React from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./styles.css";

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <Home />
    </LanguageProvider>
  );
}

export default App;