const HealthLog = require('../Models/HealthLog');
const PetProfile = require('../Models/PetProfile');

// POST /api/health-logs
const createHealthLog = async (req, res) => {
  try {
    const pet = await PetProfile.findOne({ _id: req.body.pet, owner: req.user._id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const log = await HealthLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/health-logs/pet/:id
const getHealthLogsByPet = async (req, res) => {
  try {
    const pet = await PetProfile.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    const logs = await HealthLog.find({ pet: req.params.id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/health-logs/:id
const deleteHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const pet = await PetProfile.findOne({ _id: log.pet, owner: req.user._id });
    if (!pet) return res.status(403).json({ message: 'Not authorized' });

    await log.deleteOne();
    res.status(200).json({ message: 'Health log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createHealthLog, getHealthLogsByPet, deleteHealthLog };
