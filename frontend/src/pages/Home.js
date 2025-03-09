import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Recipe Sharing Platform!!</h1>
          <p>Discover & Share Amazing Recipes with Food Lovers Around the World</p>
          <div className="home-buttons">
            <Link to="/login" className="home-button login">Login</Link>
            <Link to="/register" className="home-button register">Register</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://tinyurl.com/5n6bu5fj" alt="Delicious Food" />
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="featured-recipes-section">
        <h2>Featured Recipes</h2>
        <div className="recipe-grid">
          <div className="recipe-card">
            <img src="/recipe1.jpg" alt="Recipe 1" />
            <h3>Spicy Pasta</h3>
            <p>A delicious and easy-to-make spicy pasta recipe.</p>
          </div>
          <div className="recipe-card">
            <img src="/recipe2.jpg" alt="Recipe 2" />
            <h3>Vegan Burger</h3>
            <p>A healthy and tasty vegan burger for all food lovers.</p>
          </div>
          <div className="recipe-card">
            <img src="/recipe3.jpg" alt="Recipe 3" />
            <h3>Chocolate Cake</h3>
            <p>Indulge in this rich and moist chocolate cake.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>"This platform has changed the way I cook! So many amazing recipes to try."</p>
            <h4>- John Doe</h4>
          </div>
          <div className="testimonial-card">
            <p>"I love sharing my recipes and getting feedback from the community."</p>
            <h4>- Jane Smith</h4>
          </div>
          <div className="testimonial-card">
            <p>"The best recipe sharing platform out there. Highly recommend it!"</p>
            <h4>- Emily Johnson</h4>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section">
        <h2>Join Our Community Today!</h2>
        <p>Sign up now to start sharing and discovering amazing recipes.</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button login">Login</Link>
          <Link to="/register" className="cta-button register">Register</Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <p>&copy; 2023 Recipe Sharing Platform. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/contact-us">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;