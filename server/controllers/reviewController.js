const Review = require('../Models/Review');
const Resource = require('../Models/Resource');

// Recalculate a resource's average rating and count
const recalcRatings = async (resourceId) => {
  const reviews = await Review.find({ resource: resourceId });
  const count = reviews.length;
  const average = count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  await Resource.findByIdAndUpdate(resourceId, {
    ratings: { average, count },
  });
};

// POST /api/reviews  body: { resourceId, rating, comment }
const createReview = async (req, res) => {
  try {
    const { resourceId, rating, comment } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const existing = await Review.findOne({ resource: resourceId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this resource' });
    }

    const review = await Review.create({
      resource: resourceId,
      user: req.user._id,
      rating,
      comment,
    });

    await recalcRatings(resourceId);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createReview };
