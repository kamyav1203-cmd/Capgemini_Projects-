import React from "react";
import TemperatureConverter from "./Components/TemperatureConverter"; // ✅ changed

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>State vs Props Demo</h1>
      <TemperatureConverter /> {/* ✅ changed */}
    </div>
  );
}

export default App;