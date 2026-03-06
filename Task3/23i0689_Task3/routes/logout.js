const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Destroy the session 
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.send('Logout successful');
    });
});

module.exports = router;