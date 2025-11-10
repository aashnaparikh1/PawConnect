const express = require('express');
const Resource = require('../Models/Resource');
const Review = require('../Models/Review');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all resources with filters
router.get('/', async (req, res) => {
  try {
    const { type, city, state, search } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (state) filter['address.state'] = new RegExp(state, 'i');
    if (search) filter.name = new RegExp(search, 'i');

    const resources = await Resource.find(filter)
      .populate('submittedBy', 'firstName lastName')
      .sort({ 'ratings.average': -1, createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single resource with reviews
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const reviews = await Review.find({ resource: req.params.id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ resource, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new resource
router.post('/', protect, async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      submittedBy: req.user._id,
    });

    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update resource
router.put('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Only admin or submitter can update
    if (resource.submittedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'shelter') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(resource, req.body);
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify resource (admin only)
router.put('/:id/verify', protect, admin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.verified = true;
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete resource
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
