const Resource = require('../Models/Resource');
const Review = require('../Models/Review');

// GET /api/resources?type=&city=&state=&search=
const getAllResources = async (req, res) => {
  try {
    const { type, city, state, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (state) query['address.state'] = { $regex: state, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/resources/:id  -> { resource, reviews }
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const reviews = await Review.find({ resource: req.params.id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ resource, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/resources
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, submittedBy: req.user._id });
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllResources, getResourceById, createResource };
