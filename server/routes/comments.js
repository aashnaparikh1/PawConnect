const express = require('express');
const Comment = require('../Models/Comment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get comments for a reference
router.get('/:referenceType/:referenceId', async (req, res) => {
  try {
    const comments = await Comment.find({
      referenceType: req.params.referenceType,
      referenceId: req.params.referenceId,
      parentComment: null,
    })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Get replies for each comment
    for (let comment of comments) {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('user', 'firstName lastName')
        .sort({ createdAt: 1 });
      comment._doc.replies = replies;
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create comment
router.post('/', protect, async (req, res) => {
  try {
    const comment = new Comment({
      ...req.body,
      user: req.user._id,
    });

    const createdComment = await comment.save();
    const populatedComment = await Comment.findById(createdComment._id)
      .populate('user', 'firstName lastName');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/unlike comment
router.put('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const index = comment.likes.indexOf(req.user._id);
    if (index > -1) {
      comment.likes.splice(index, 1);
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
