const express = require('express');
const Event = require('../Models/Event');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { upcoming, past } = req.query;
    const now = new Date();
    
    let filter = {};
    if (upcoming === 'true') {
      filter.date = { $gte: now };
    } else if (past === 'true') {
      filter.date = { $lt: now };
    }

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email')
      .populate('rsvps.user', 'firstName lastName');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (admin/shelter only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RSVP to event
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove existing RSVP if any
    event.rsvps = event.rsvps.filter(
      rsvp => rsvp.user.toString() !== req.user._id.toString()
    );

    // Add new RSVP
    event.rsvps.push({
      user: req.user._id,
      status: status || 'Going',
    });

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
