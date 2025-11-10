const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  weight: {
    type: Number,
  },
  color: {
    type: String,
  },
  microchipId: {
    type: String,
  },
  photo: {
    type: String,
  },
  medicalInfo: {
    allergies: [String],
    conditions: [String],
    medications: [String],
    veterinarian: {
      name: String,
      phone: String,
      clinic: String,
    },
  },
  adoptedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
  },
}, { timestamps: true });

module.exports = mongoose.model('PetProfile', petProfileSchema);
