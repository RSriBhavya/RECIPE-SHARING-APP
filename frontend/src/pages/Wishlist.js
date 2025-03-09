import React, { useEffect, useState } from "react";
import "../styles/Wishlist.css"; // Ensure this is linked properly

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    const removeFromWishlist = (id) => {
        const updatedWishlist = wishlist.filter((item) => item.id !== id);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    return (
        <div className="wishlist-container">
            <h1 className="wishlist-title">Your Wishlist</h1>
            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((recipe) => (
                        <div key={recipe.id} className="wishlist-card">
                            <img src={recipe.image} alt={recipe.name} />
                            <h3>{recipe.name}</h3>
                            <button className="remove-btn" onClick={() => removeFromWishlist(recipe.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
