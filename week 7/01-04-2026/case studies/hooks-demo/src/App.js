import React, { useState, useReducer } from "react";

function App() {

  /*
  // counter
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const incrementByTwo = () => setCount(prev => prev + 2);
  const resetCount = () => setCount(0);

  // lazy init
  const [data, setData] = useState(() => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) result += i;
    return result % 1000;
  });

  const recalculateData = () => {
    setData(prev => prev + 100);
  };

  // object state
  const [user, setUser] = useState({
    name: "",
    age: "",
    email: ""
  });

  const updateUserName = (name) => {
    setUser(prev => ({ ...prev, name }));
  };

  const updateUserAge = (age) => {
    setUser(prev => ({ ...prev, age }));
  };

  const updateUserEmail = (email) => {
    setUser(prev => ({ ...prev, email }));
  };

  const resetUser = () => {
    setUser({ name: "", age: "", email: "" });
  };

  // array state
  const [items, setItems] = useState([]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "Item " + (items.length + 1),
      created: new Date().toLocaleTimeString()
    };
    setItems(prev => [...prev, newItem]);
  };

  const addMultipleItems = () => {
    const newItems = [
      { id: Date.now(), name: "Batch Item 1", created: new Date().toLocaleTimeString() },
      { id: Date.now() + 1, name: "Batch Item 2", created: new Date().toLocaleTimeString() },
      { id: Date.now() + 2, name: "Batch Item 3", created: new Date().toLocaleTimeString() }
    ];
    setItems(prev => [...prev, ...newItems]);
  };

  const updateItem = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, name: "Updated Item", updated: new Date().toLocaleTimeString() }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const deleteAllItems = () => {
    setItems([]);
  };
  */

  const initialState = {
    count: 0,
    history: []
  };

  function reducer(state, action) {
    switch (action.type) {
      case "increment":
        return {
          count: state.count + 1,
          history: [
            ...state.history,
            { type: "increment", value: state.count + 1, time: new Date().toLocaleTimeString() }
          ]
        };

      case "decrement":
        return {
          count: state.count - 1,
          history: [
            ...state.history,
            { type: "decrement", value: state.count - 1, time: new Date().toLocaleTimeString() }
          ]
        };

      case "reset":
        return {
          count: 0,
          history: [
            ...state.history,
            { type: "reset", value: 0, time: new Date().toLocaleTimeString() }
          ]
        };

      case "set":
        return {
          count: action.payload,
          history: [
            ...state.history,
            { type: "set", value: action.payload, time: new Date().toLocaleTimeString() }
          ]
        };

      case "clearHistory":
        return {
          ...state,
          history: []
        };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");

  return (
    <div style={styles.container}>
      <h1>useReducer Counter</h1>

      <h2>Count: {state.count}</h2>

      <div>
        <button style={styles.btn} onClick={() => dispatch({ type: "increment" })}>+1</button>
        <button style={styles.btn} onClick={() => dispatch({ type: "decrement" })}>-1</button>
        <button style={styles.resetBtn} onClick={() => dispatch({ type: "reset" })}>Reset</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />

        <button
          style={styles.btn}
          onClick={() => dispatch({ type: "set", payload: Number(input) })}
        >
          Set Value
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          style={styles.deleteBtn}
          onClick={() => dispatch({ type: "clearHistory" })}
        >
          Clear History
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>
        History ({state.history.length})
      </h3>

      <ul style={styles.list}>
        {state.history.map((item, index) => (
          <li key={index} style={styles.card}>
            <b>{item.type.toUpperCase()}</b> → {item.value}
            <br />
            <small>{item.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "40px",
    fontFamily: "Arial"
  },
  btn: {
    margin: "10px",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white"
  },
  resetBtn: {
    margin: "10px",
    padding: "10px 15px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px"
  },
  deleteBtn: {
    margin: "10px",
    padding: "10px 15px",
    backgroundColor: "#555",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px"
  },
  input: {
    padding: "10px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  card: {
    border: "1px solid #ccc",
    margin: "10px auto",
    padding: "10px",
    width: "250px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  }
};

export default App;