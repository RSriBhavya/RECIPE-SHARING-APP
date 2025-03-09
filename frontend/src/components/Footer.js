import React from "react";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="join-community">
        <h2>Join Our Community Today!</h2>
        <p>Sign up now to start sharing and discovering amazing recipes.</p>
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>
        </div>
      </div>
      <div className="footer">
        <p>© 2025 Recipe Sharing App. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
