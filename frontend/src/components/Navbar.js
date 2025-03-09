import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          MyRecipes
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>
          {isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
        </ul>

        {/* Right Side - Search & Login */}
        <div className="nav-actions">
          
          {!isLoggedIn && <Link to="/login" className="login-btn">Login</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
