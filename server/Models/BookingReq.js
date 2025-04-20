const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  bookedBy: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  hall: {
    type: String,
    trim: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

BookingSchema.statics.checkAvailability = async function(start, end, hall, bookingId = null) {
  const query = {
    hall: hall,
    $or: [
      { start: { $lte: start }, end: { $gt: start } },
      { start: { $lt: end }, end: { $gte: end } },
      { start: { $gte: start }, end: { $lte: end } }
    ]
  };
  
  if (bookingId) {
    query._id = { $ne: bookingId };
  }
  
  const existingBooking = await this.findOne(query);
  return !existingBooking; 
};

module.exports = mongoose.model('Booking', BookingSchema);
