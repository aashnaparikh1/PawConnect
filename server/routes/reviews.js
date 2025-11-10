const express = require('express');
const Review = require('../Models/Review');
const Resource = require('../Models/Resource');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Submit review
router.post('/', protect, async (req, res) => {
  try {
    const { resourceId, rating, comment } = req.body;

    // Check if user already reviewed this resource
    const existingReview = await Review.findOne({
      resource: resourceId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this resource' });
    }

    const review = await Review.create({
      resource: resourceId,
      user: req.user._id,
      rating,
      comment,
    });

    // Update resource rating
    const reviews = await Review.find({ resource: resourceId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Resource.findByIdAndUpdate(resourceId, {
      'ratings.average': avgRating,
      'ratings.count': reviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark review as helpful
router.put('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const index = review.helpful.indexOf(req.user._id);
    if (index > -1) {
      review.helpful.splice(index, 1);
    } else {
      review.helpful.push(req.user._id);
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
