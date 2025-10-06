const express = require('express');
const router = express.Router();

// In-memory store for cats
const cats = [
  { name: 'Whiskers', age: 2, gender: 'female' },
  { name: 'Luna', age: 4, gender: 'female' }
];

// GET /cats - list all cats
router.get('/', (req, res) => {
  res.json(cats);
});

// POST /cats - add a new cat
router.post('/', (req, res) => {
  const newCat = req.body;
  if (!newCat || !newCat.name) {
    return res.status(400).json({ message: 'Invalid cat payload' });
  }
  cats.push(newCat);
  res.status(201).json({ message: 'Cat added successfully', cat: newCat });
});

module.exports = router;


