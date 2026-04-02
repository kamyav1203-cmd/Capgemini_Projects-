import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("isAuth", "true");
      navigate("/dashboard");
    } else {
      alert("Enter email and password");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

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

        <button className="btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;