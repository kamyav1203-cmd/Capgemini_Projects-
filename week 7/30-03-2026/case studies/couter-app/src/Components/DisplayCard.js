import React from "react";

function DisplayCard({ title, value, onChange, style }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        margin: "20px auto",
        width: "300px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        ...style,
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</p>

      <button onClick={() => onChange(value + 1)}>➕</button>

      <button
        onClick={() => onChange(value - 1)}
        style={{ marginLeft: "10px" }}
      >
        ➖
      </button>
    </div>
  );
}

export default DisplayCard;