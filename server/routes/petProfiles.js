const express = require('express');
const PetProfile = require('../Models/PetProfile');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user's pets
router.get('/my-pets', protect, async (req, res) => {
  try {
    const pets = await PetProfile.find({ owner: req.user._id })
      .populate('adoptedFrom', 'name breed')
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single pet
router.get('/:id', protect, async (req, res) => {
  try {
    const pet = await PetProfile.findById(req.params.id)
      .populate('adoptedFrom', 'name breed');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user owns this pet
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create pet profile
router.post('/', protect, async (req, res) => {
  try {
    const pet = new PetProfile({
      ...req.body,
      owner: req.user._id,
    });

    const createdPet = await pet.save();
    res.status(201).json(createdPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update pet profile
router.put('/:id', protect, async (req, res) => {
  try {
    const pet = await PetProfile.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(pet, req.body);
    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete pet profile
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await PetProfile.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pet.deleteOne();
    res.json({ message: 'Pet profile removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
