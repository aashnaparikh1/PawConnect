const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  animalType: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    required: true,
  },
  color: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  temperament: {
    type: [String],
    default: [],
  },
  medicalHistory: {
    vaccinated: {
      type: Boolean,
      default: false,
    },
    neutered: {
      type: Boolean,
      default: false,
    },
    healthIssues: String,
  },
  images: [{
    type: String,
  }],
  location: {
    shelter: String,
    city: String,
    state: String,
  },
  adoptionStatus: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available',
  },
  adoptionFee: {
    type: Number,
    default: 0,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
