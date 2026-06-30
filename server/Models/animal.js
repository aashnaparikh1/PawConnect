const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    animalType: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
    },
    color: {
      type: String,
    },
    description: {
      type: String,
    },
    temperament: [{
      type: String,
    }],
    medicalHistory: {
      vaccinated: { type: Boolean, default: false },
      neutered: { type: Boolean, default: false },
      healthIssues: { type: String },
    },
    location: {
      shelter: String,
      city: String,
      state: String,
    },
    adoptionFee: {
      type: Number,
      default: 0,
    },
    adoptionStatus: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted'],
      default: 'Available',
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Animal", animalSchema);
