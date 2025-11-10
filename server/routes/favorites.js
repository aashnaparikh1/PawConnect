const express = require('express');
const User = require('../Models/User');
const Animal = require('../Models/animal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Add to favorites
router.post('/:animalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if animal exists
    const animal = await Animal.findById(req.params.animalId);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    
    // Check if already in favorites
    if (!user.favorites.includes(req.params.animalId)) {
      user.favorites.push(req.params.animalId);
      await user.save();
      res.json({ message: 'Added to favorites', favorites: user.favorites });
    } else {
      res.json({ message: 'Already in favorites', favorites: user.favorites });
    }
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:animalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.animalId);
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's favorites
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check if animal is in favorites
router.get('/check/:animalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavorite = user.favorites.includes(req.params.animalId);
    res.json({ isFavorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
