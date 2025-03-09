import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`https://mern-recipesharing.onrender.com/api/recipes/${id}`);
                setRecipe(response.data);
            } catch (err) {
                setError('Failed to fetch recipe details.');
            }
        };

        fetchRecipe();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!recipe) return <div>Loading...</div>;

    return (
        <div className="recipe-details-container">
            <h1>{recipe.title}</h1>
            <img 
                src={recipe.image} 
                alt={recipe.title} 
                style={{ width: '100%', maxWidth: '500px', borderRadius: '10px' }} 
            />
            <p><strong>Category:</strong> {recipe.category}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            {recipe.tips && <p><strong>Tips:</strong> {recipe.tips}</p>}
        </div>
    );
};

export default RecipeDetails;
