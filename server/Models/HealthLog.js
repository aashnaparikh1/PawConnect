const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PetProfile',
    required: true,
  },
  logType: {
    type: String,
    required: true,
    enum: ['Vaccination', 'Medication', 'Vet Visit', 'Weight', 'Grooming', 'Exercise', 'Diet', 'Symptom', 'Other'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  details: {
    weight: Number,
    temperature: Number,
    medication: String,
    dosage: String,
    veterinarian: String,
    cost: Number,
    nextDueDate: Date,
  },
  attachments: [{
    type: String,
  }],
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
