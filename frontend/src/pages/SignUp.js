import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }
    alert(`Account created for: ${username}`);
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="auth-container register-page">
      <div className="auth-box">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <span onClick={() => navigate("/")}>Login</span></p>
      </div>
    </div>
  );
};

export default SignUp;
