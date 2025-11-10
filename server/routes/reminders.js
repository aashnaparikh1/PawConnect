const express = require('express');
const Reminder = require('../Models/Reminder');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user's reminders
router.get('/', protect, async (req, res) => {
  try {
    const { completed } = req.query;
    const filter = { user: req.user._id };
    
    if (completed === 'true') {
      filter.completed = true;
    } else if (completed === 'false') {
      filter.completed = false;
    }

    const reminders = await Reminder.find(filter)
      .populate('pet', 'name species')
      .sort({ dueDate: 1 });
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create reminder
router.post('/', protect, async (req, res) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      user: req.user._id,
    });

    const createdReminder = await reminder.save();
    res.status(201).json(createdReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark reminder as completed
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder || reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reminder.completed = true;
    reminder.completedAt = Date.now();
    await reminder.save();

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update reminder
router.put('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder || reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(reminder, req.body);
    const updatedReminder = await reminder.save();
    res.json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete reminder
router.delete('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder || reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await reminder.deleteOne();
    res.json({ message: 'Reminder removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
