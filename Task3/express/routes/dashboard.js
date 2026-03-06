const express = require('express');
const router = express.Router();

// Middleware: Check if user is logged in 
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); // User is logged in, proceed to the route
    } else {
        res.status(401).send('Unauthorized: Please log in first');
    }
};

// GET /dashboard (Protected Route) 
router.get('/', isAuthenticated, (req, res) => {
    res.send(`Welcome ${req.session.user}`); // Expected output 
});

module.exports = router;