const express = require('express');
const router = express.Router();

// GET all comments
router.get('/', (req, res) => {
  res.json({ message: 'Get all comments' });
});

// GET comment by ID
router.get('/:id', (req, res) => {
  const commentId = req.params.id;
  res.json({ message: `Get comment with ID: ${commentId}` });
});

// POST create new comment
router.post('/', (req, res) => {
  const { text, userId } = req.body;
  res.json({ message: 'Comment created', comment: { text, userId } });
});

// DELETE comment
router.delete('/:id', (req, res) => {
  const commentId = req.params.id;
  res.json({ message: `Comment ${commentId} deleted` });
});

module.exports = router;