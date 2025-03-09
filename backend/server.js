const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => console.log(err));

// Routes

// Home route
app.get('/', (req, res) => {
    res.send("<h1 align='center'>Welcome to the Recipe Sharing Backend</h1>");
});

// Register with validation
app.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User Registered..." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login with validation
app.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: "Login successful!" });
    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Check authentication status
app.get('/check-auth', auth, async (req, res) => {
    try {
        res.json({ isLoggedIn: true, user: req.user });
    } catch (err) {
        res.json({ isLoggedIn: false });
    }
});

// Refresh token
app.post('/refresh-token', auth, async (req, res) => {
    try {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: "Token refreshed successfully!" });
    } catch (err) {
        console.log("Error refreshing token:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Logout
app.post('/logout', auth, async (req, res) => {
    try {
        res.json({ message: "Logged out successfully!" });
    } catch (err) {
        console.log("Error logging out:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get user profile
app.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.log("Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Create a recipe (protected route)
// Create a recipe (protected route)
app.post('/recipes', auth, upload.single('image'), async (req, res) => {
    const { title, ingredients, instructions, category } = req.body;

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const recipe = new Recipe({
            title,
            ingredients: JSON.parse(ingredients),
            instructions,
            image: req.file ? req.file.path : req.body.imageUrl || null, // ✅ Restored URL support
            category,
            user: req.user.id,
            ratings: []
        });

        await recipe.save();
        res.status(201).json(recipe);

    } catch (err) {
        console.error("Error creating recipe:", err.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


// Get all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('user', 'username');
        res.json(recipes);
    } catch (err) {
        console.log("Error fetching recipes:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('user', 'username')
            .populate('comments.user', 'username');
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        console.log("Error fetching recipe:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a recipe (protected route)
app.put('/recipes/:id', auth, async (req, res) => {
    const { title, ingredients, instructions, image } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Check if the logged-in user owns the recipe
        if (recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update the recipe fields
        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.image = image || recipe.image;

        await recipe.save();
        res.json(recipe);
    } catch (err) {
        console.log("Error updating recipe:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a recipe (protected route)
app.delete('/recipes/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Check if the logged-in user owns the recipe
        if (recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await recipe.deleteOne();
        res.json({ message: "Recipe deleted" });
    } catch (err) {
        console.log("Error deleting recipe:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Save recipe to wishlist
app.post('/recipes/:id/save', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the recipe is already saved
        if (user.savedRecipes.includes(recipe._id)) {
            return res.status(400).json({ message: "Recipe already saved" });
        }

        // Save the recipe to the user's wishlist
        user.savedRecipes.push(recipe._id);
        await user.save();

        res.json({ message: "Recipe saved successfully!" });
    } catch (err) {
        console.log("Error saving recipe:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch saved recipes
app.get('/users/:id/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('savedRecipes');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.savedRecipes);
    } catch (err) {
        console.log("Error fetching saved recipes:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Rate a recipe
app.post('/recipes/:id/rate', auth, async (req, res) => {
    const { value } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Ensure ratings is an array
        if (!recipe.ratings || !Array.isArray(recipe.ratings)) {
            recipe.ratings = [];
        }

        // Check if the user has already rated the recipe
        const existingRating = recipe.ratings.find(rating => rating.user.toString() === req.user.id);
        if (existingRating) {
            return res.status(400).json({ message: "You have already rated this recipe" });
        }

        // Add the rating
        recipe.ratings.push({ user: req.user.id, value });
        await recipe.save();

        res.json({ message: "Recipe rated successfully!" });
    } catch (err) {
        console.log("Error rating recipe:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Comment on a recipe
app.post('/recipes/:id/comment', auth, async (req, res) => {
    const { text } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Add the comment
        recipe.comments.push({ user: req.user.id, text });
        await recipe.save();

        res.json({ message: "Comment added successfully!" });
    } catch (err) {
        console.log("Error adding comment:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get recipes by category
app.get('/recipes/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const recipes = await Recipe.find({ category }).populate('user', 'username');
        res.json(recipes);
    } catch (err) {
        console.log("Error fetching recipes by category:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});