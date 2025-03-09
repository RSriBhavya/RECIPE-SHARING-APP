import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/RecipeSubmission.css";

const RecipeSubmission = () => {
    const [recipe, setRecipe] = useState({
        title: "",
        imageUrl: "",
        file: null,
        ingredients: "",
        instructions: "",
        category: "Breakfast",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleFileChange = (e) => {
        setRecipe({ ...recipe, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token"); // ✅ Restored Token Usage
        if (!token) {
            setError("You must be logged in to submit a recipe.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", recipe.title);
            formData.append("ingredients", JSON.stringify(recipe.ingredients.split(",").map((item) => item.trim())));
            formData.append("instructions", recipe.instructions);
            formData.append("image", recipe.file); 
            formData.append("imageUrl", recipe.imageUrl); // ✅ Restored URL Support
            formData.append("category", recipe.category);
            formData.append("user", JSON.parse(localStorage.getItem("user"))._id);

            const response = await axios.post("https://mern-recipesharing.onrender.com", formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Restored Token for Auth
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Recipe submitted:", response.data);
            alert("Recipe Submitted Successfully!");
            navigate("/recipes");
        } catch (err) {
            console.error("Error submitting recipe:", err);
            setError("Failed to submit recipe. Please try again.");
        }
    };

    return (
        <div className="recipe-submission-container">
            <h1>Submit Your Recipe</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Recipe Name:</label>
                <input
                    type="text"
                    name="title"
                    value={recipe.title}
                    onChange={handleChange}
                    required
                />

                <label>Image URL:</label>
                <input
                    type="text"
                    name="imageUrl"
                    value={recipe.imageUrl}
                    onChange={handleChange}
                    placeholder="Or upload an image below"
                />

                <label>Upload Image:</label>
                <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                />

                <label>Ingredients (comma-separated):</label>
                <textarea
                    name="ingredients"
                    value={recipe.ingredients}
                    onChange={handleChange}
                    required
                ></textarea>

                <label>Recipe Instructions:</label>
                <textarea
                    name="instructions"
                    value={recipe.instructions}
                    onChange={handleChange}
                    required
                ></textarea>

                <label>Category:</label>
                <select
                    name="category"
                    value={recipe.category}
                    onChange={handleChange}
                    required
                >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                </select>

                <button type="submit">Submit Recipe</button>
            </form>
        </div>
    );
};

export default RecipeSubmission;
