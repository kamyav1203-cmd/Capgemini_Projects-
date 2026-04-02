import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (name && email && password) {
      localStorage.setItem("user", JSON.stringify({ name, email }));
      navigate("/auth/login");
    } else {
      alert("Fill all fields");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button className="btn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;