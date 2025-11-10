const express = require('express');
const User = require('../Models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Add to favorites
router.post('/:animalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.includes(req.params.animalId)) {
      user.favorites.push(req.params.animalId);
      await user.save();
    }

    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:animalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.animalId);
    await user.save();

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's favorites
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
