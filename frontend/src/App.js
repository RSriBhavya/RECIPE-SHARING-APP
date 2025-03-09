import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Recipes from "./pages/Recipes";
import Wishlist from "./pages/Wishlist";
import RecipeSubmission from "./pages/RecipeSubmission";
import Profile from "./pages/Profile";
import RecipeDetails from './pages/RecipeDetails';
import Navbar from "./components/Navbar"; 
import "./styles/Navbar.css";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} /> 

      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/submit-recipe" element={<RecipeSubmission />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
