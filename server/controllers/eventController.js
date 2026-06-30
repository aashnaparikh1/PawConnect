const Event = require('../Models/Event');

// GET /api/events?upcoming=true | ?past=true | ?eventType=...
const getAllEvents = async (req, res) => {
  try {
    const { upcoming, past, eventType } = req.query;
    const query = {};
    const now = new Date();

    if (upcoming === 'true') query.date = { $gte: now };
    if (past === 'true') query.date = { $lt: now };
    if (eventType) query.eventType = eventType;

    const sort = past === 'true' ? { date: -1 } : { date: 1 };

    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName')
      .populate('rsvps.user', 'firstName lastName')
      .sort(sort);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName')
      .populate('rsvps.user', 'firstName lastName');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// POST /api/events/:id/rsvp  body: { status }
const rsvpEvent = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id.toString();
    const existing = event.rsvps.find((r) => r.user && r.user.toString() === userId);

    if (existing) {
      existing.status = status;
      existing.respondedAt = new Date();
    } else {
      event.rsvps.push({ user: req.user._id, status });
    }

    await event.save();
    const populated = await Event.findById(event._id)
      .populate('organizer', 'firstName lastName')
      .populate('rsvps.user', 'firstName lastName');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, rsvpEvent };
