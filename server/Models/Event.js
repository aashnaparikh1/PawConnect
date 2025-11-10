const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['Adoption Drive', 'Fundraiser', 'Workshop', 'Community Meetup', 'Awareness Campaign', 'Other'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  location: {
    venue: String,
    address: String,
    city: String,
    state: String,
  },
  image: {
    type: String,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  capacity: {
    type: Number,
  },
  rsvps: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Going', 'Maybe', 'Not Going'],
      default: 'Going',
    },
    respondedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isVirtual: {
    type: Boolean,
    default: false,
  },
  virtualLink: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
