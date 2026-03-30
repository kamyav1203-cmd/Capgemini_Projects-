import React, { useState } from "react";

function Todo() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTask = () => {
    if (!task.trim()) return;
    setTodos([...todos, { text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Todo List</h2>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addBtn}>
            Add
          </button>
        </div>

        <ul style={styles.list}>
          {todos.map((todo, index) => (
            <li key={index} style={styles.item}>
              <span
                onClick={() => toggleComplete(index)}
                style={{
                  ...styles.text,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#888" : "#000"
                }}
              >
                {todo.completed ? "☑" : "☐"} {todo.text}
              </span>

              <button
                onClick={() => deleteTask(index)}
                style={styles.deleteBtn}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
    fontFamily: "Arial"
  },
  box: {
    width: "350px",
    padding: "20px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  heading: {
    textAlign: "center",
    marginBottom: "15px"
  },
  inputRow: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  addBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer"
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "15px"
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #eee"
  },
  text: {
    cursor: "pointer"
  },
  deleteBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer"
  }
};

export default Todo;