const express = require('express');
const Application = require('../Models/Application');
const Animal = require('../Models/animal');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Submit adoption application
router.post('/', protect, async (req, res) => {
  try {
    const { animalId, homeType, hasYard, otherPets, otherPetsDetails, experience, reason } = req.body;

    // Check if animal is available
    const animal = await Animal.findById(animalId);
    if (!animal || animal.adoptionStatus !== 'Available') {
      return res.status(400).json({ message: 'Animal is not available for adoption' });
    }

    // Check if user already applied for this animal
    const existingApplication = await Application.findOne({
      user: req.user._id,
      animal: animalId,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this pet' });
    }

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

    // Update animal status to Pending
    animal.adoptionStatus = 'Pending';
    await animal.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('animal')
      .populate('user', 'firstName lastName email phone');

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's applications
router.get('/my-applications', protect, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('animal')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('animal')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id);

    if (application) {
      application.status = status;
      application.notes = notes;
      application.reviewedBy = req.user._id;
      application.reviewDate = Date.now();

      // Update animal status based on application status
      const animal = await Animal.findById(application.animal);
      if (status === 'Approved') {
        animal.adoptionStatus = 'Adopted';
      } else if (status === 'Rejected') {
        // Check if there are other pending applications
        const pendingApps = await Application.find({
          animal: animal._id,
          status: 'Pending',
          _id: { $ne: application._id },
        });
        if (pendingApps.length === 0) {
          animal.adoptionStatus = 'Available';
        }
      }
      await animal.save();

      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
