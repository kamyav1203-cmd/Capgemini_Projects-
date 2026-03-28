// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple React component
function App() {
  return (
    <div>
      <h1>Welcome to React Training</h1>
      <p>This is rendered by React, not vanilla JavaScript!</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);