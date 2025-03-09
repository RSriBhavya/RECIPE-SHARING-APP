const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Log the decoded token
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Token verification failed:", err); // Log the error
        res.status(400).json({ message: "Invalid token" });
    }
};