const express = require('express');
const Animal = require('../Models/animal');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all animals with filters
router.get('/', async (req, res) => {
  try {
    const { animalType, breed, age, size, gender, status } = req.query;
    
    const filter = {};
    if (animalType) filter.animalType = animalType;
    if (breed) filter.breed = new RegExp(breed, 'i');
    if (age) filter.age = { $lte: parseInt(age) };
    if (size) filter.size = size;
    if (gender) filter.gender = gender;
    if (status) filter.adoptionStatus = status;

    const animals = await Animal.find(filter).populate('addedBy', 'firstName lastName');
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single animal
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate('addedBy', 'firstName lastName email phone');
    
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create animal (admin/shelter only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const animal = new Animal({
      ...req.body,
      addedBy: req.user._id,
    });

    const createdAnimal = await animal.save();
    res.status(201).json(createdAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update animal (admin/shelter only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (animal) {
      Object.assign(animal, req.body);
      const updatedAnimal = await animal.save();
      res.json(updatedAnimal);
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete animal (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (animal) {
      await animal.deleteOne();
      res.json({ message: 'Animal removed' });
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
