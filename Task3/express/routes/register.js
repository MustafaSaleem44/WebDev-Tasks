const express = require('express');
const router = express.Router();
const User = require('../User'); // Import User class from the parent directory

// POST /register
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    const result = await user.register();
    
    if (result.success) {
        res.send('User registered successfully'); // Expected output 
    } else {
        res.status(400).send(result.message);
    }
});

module.exports = router;