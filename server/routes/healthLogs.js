const express = require('express');
const HealthLog = require('../Models/HealthLog');
const PetProfile = require('../Models/PetProfile');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get health logs for a pet
router.get('/pet/:petId', protect, async (req, res) => {
  try {
    const pet = await PetProfile.findById(req.params.petId);
    
    if (!pet || pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const logs = await HealthLog.find({ pet: req.params.petId })
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create health log
router.post('/', protect, async (req, res) => {
  try {
    const pet = await PetProfile.findById(req.body.pet);
    
    if (!pet || pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const log = await HealthLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update health log
router.put('/:id', protect, async (req, res) => {
  try {
    const log = await HealthLog.findById(req.params.id).populate('pet');

    if (!log || log.pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(log, req.body);
    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete health log
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await HealthLog.findById(req.params.id).populate('pet');

    if (!log || log.pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await log.deleteOne();
    res.json({ message: 'Health log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
