import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
    const [user, setUser] = useState({
        name: "Jane Doe",
        profilePic: "https://via.placeholder.com/100",
    });
    
    const [submittedRecipes, setSubmittedRecipes] = useState([
        { id: 1, name: "Spaghetti Carbonara", image: "https://via.placeholder.com/150" },
        { id: 2, name: "Classic Margherita Pizza", image: "https://via.placeholder.com/150" }
    ]);
    
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    return (
        <div className="profile-container">


            {/* Profile Info */}
            <div className="profile-header">
                <img src={user.profilePic} alt="Profile" className="profile-pic" />
                <h2>{user.name}</h2>
            </div>

            {/* Submitted Recipes */}
            <div className="recipe-section">
                <h3>Your Recipes</h3>
                <div className="recipes-grid">
                    {submittedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img src={recipe.image} alt={recipe.name} />
                            <h4>{recipe.name}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Wishlist */}
            <div className="recipe-section">
                <h3>Wishlist</h3>
                <div className="recipes-grid">
                    {wishlist.length > 0 ? wishlist.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img src={recipe.image} alt={recipe.name} />
                            <h4>{recipe.name}</h4>
                        </div>
                    )) : <p>No saved recipes yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
