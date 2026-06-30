const mongoose = require('mongoose');
const Application = require('../Models/Application');
const Animal = require('../Models/animal');

// POST /api/applications
const createApplication = async (req, res) => {
  try {
    const { animalId, homeType, hasYard, otherPets, otherPetsDetails, experience, reason } = req.body;

    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    const application = await Application.create({
      user: req.user._id,
      animal: animalId,
      homeType,
      hasYard,
      otherPets,
      otherPetsDetails,
      experience,
      reason,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/applications/my-applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('animal')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/applications  (admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('animal')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/applications/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('animal')
      .populate('user', 'firstName lastName email phone');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/applications/:id  (admin) body: { status, notes }
const updateApplication = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (mongoose.isValidObjectId(req.user._id)) application.reviewedBy = req.user._id;
    application.reviewDate = new Date();
    await application.save();

    // Keep the animal's adoption status in sync
    if (status === 'Approved') {
      await Animal.findByIdAndUpdate(application.animal, { adoptionStatus: 'Pending' });
    } else if (status === 'Completed') {
      await Animal.findByIdAndUpdate(application.animal, { adoptionStatus: 'Adopted' });
    } else if (status === 'Rejected') {
      await Animal.findByIdAndUpdate(application.animal, { adoptionStatus: 'Available' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplication,
};
