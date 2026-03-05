const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

// GET user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Get user with ID: ${userId}` });
});

// POST create new user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.json({ message: 'User created', user: { name, email } });
});

// PUT update user
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ${userId} updated`, data: req.body });
});

// DELETE user
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ${userId} deleted` });
});

module.exports = router;