const express = require('express');
const router = express.Router();

// In-memory store for dogs
const dogs = [
  { name: 'Buddy', age: 3, gender: 'male' },
  { name: 'Mac', age: 1, gender: 'male' }
];

// GET /dogs - list all dogs
router.get('/', (req, res) => {
  res.json(dogs);
});

// POST /dogs - add a new dog
router.post('/', (req, res) => {
  const newDog = req.body;
  if (!newDog || !newDog.name) {
    return res.status(400).json({ message: 'Invalid dog payload' });
  }
  dogs.push(newDog);
  res.status(201).json({ message: 'Dog added successfully', dog: newDog });
});

module.exports = router;


