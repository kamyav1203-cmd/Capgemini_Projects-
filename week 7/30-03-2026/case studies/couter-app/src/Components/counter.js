import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [lastAction, setLastAction] = useState("None");

  const increment = () => {
    setCount(count + step);
    setLastAction("Incremented by " + step);
  };

  const decrement = () => {
    setCount(count - step);
    setLastAction("Decremented by " + step);
  };

  const reset = () => {
    setCount(0);
    setLastAction("Reset");
  };

  const buttonStyle = {
    margin: "0 10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px"
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>

      {/* Display current state */}
      <div style={{ fontSize: "48px", margin: "20px" }}>
        <h1>Counter: {count}</h1>
      </div>

      {/* Step input */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Step:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{ marginLeft: "10px", width: "60px" }}
          />
        </label>
      </div>

      {/* Action buttons */}
      <div>
        <button onClick={increment} style={buttonStyle}>Increment</button>
        <button onClick={decrement} style={buttonStyle}>Decrement</button>
        <button onClick={reset} style={buttonStyle}>Reset</button>
      </div>

      {/* Last action display */}
      <div style={{ marginTop: "20px", fontStyle: "italic" }}>
        Last Action: {lastAction}
      </div>

    </div>
  );
}

export default Counter;