import React, { useState } from "react";
import DisplayCard from "./DisplayCard"; // ✅ same folder now

function StateVsPropsDemo() {
  const [parentStep, setParentStep] = useState(1);
  const [parentCount, setParentCount] = useState(0);
  const [displayColor, setDisplayColor] = useState("lightblue");

  const handleParentCountChange = (newCount) => {
    setParentCount(newCount);
    setDisplayColor(newCount % 2 === 0 ? "lightblue" : "lightcoral");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Parent Count: {parentCount}</h2>

      <button onClick={() => setParentStep(parentStep + 1)}>
        Increase Step (Current: {parentStep})
      </button>

      <button
        onClick={() =>
          setDisplayColor(
            displayColor === "lightblue" ? "lightcoral" : "lightblue"
          )
        }
        style={{ marginLeft: "10px" }}
      >
        Toggle Display Color
      </button>

      <DisplayCard
        title="Child Component 1 Counter Card"
        value={parentCount}
        onChange={handleParentCountChange}
        style={{ backgroundColor: displayColor }}
      />

      <DisplayCard
        title="Child Component 2 Counter Card"
        value={parentCount}
        onChange={handleParentCountChange}
        style={{ backgroundColor: displayColor }}
      />
    </div>
  );
}

export default StateVsPropsDemo;