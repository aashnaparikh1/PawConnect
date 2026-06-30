const Reminder = require('../Models/Reminder');

// POST /api/reminders
const createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create({ ...req.body, user: req.user._id });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/reminders?completed=false
const getReminders = async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.query.completed !== undefined) {
      query.completed = req.query.completed === 'true';
    }
    const reminders = await Reminder.find(query)
      .populate('pet', 'name species')
      .sort({ dueDate: 1 });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/reminders/:id/complete
const completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    reminder.completed = true;
    reminder.completedAt = new Date();
    await reminder.save();
    res.status(200).json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReminder, getReminders, completeReminder, deleteReminder };
