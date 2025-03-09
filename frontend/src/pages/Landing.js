import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Recipe Sharing</h1>
        <p>Discover and share amazing recipes with ease!</p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/login")} className="landing-button">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="landing-button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;