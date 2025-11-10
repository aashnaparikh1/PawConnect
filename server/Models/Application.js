const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending',
  },
  homeType: {
    type: String,
    required: true,
  },
  hasYard: {
    type: Boolean,
    required: true,
  },
  otherPets: {
    type: Boolean,
    required: true,
  },
  otherPetsDetails: String,
  experience: String,
  reason: {
    type: String,
    required: true,
  },
  notes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
