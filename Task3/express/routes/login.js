const express = require('express');
const router = express.Router();
const User = require('../User'); 

// POST /login
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    const result = await user.login();

    if (result.success) {
        req.session.user = username; // Create session 
        res.send('Login successful'); // Expected output 
    } else {
        res.status(401).send(result.message);
    }
});

module.exports = router;