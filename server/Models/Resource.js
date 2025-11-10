const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Veterinary', 'Shelter', 'Pet Store', 'Grooming', 'Training', 'Emergency', 'Other'],
  },
  description: {
    type: String,
    required: true,
  },
  contact: {
    phone: String,
    email: String,
    website: String,
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: String,
  },
  hours: {
    type: String,
  },
  services: [{
    type: String,
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
