const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
   hallname: {
    type: String,
    trim: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validation to prevent overlapping bookings
BookingSchema.statics.checkAvailability = async function(start, end, bookingId = null) {
  const query = {
    $or: [
      // New booking starts during an existing booking
      { start: { $lte: start }, end: { $gt: start } },
      // New booking ends during an existing booking
      { start: { $lt: end }, end: { $gte: end } },
      // New booking completely contains an existing booking
      { start: { $gte: start }, end: { $lte: end } }
    ]
  };
  
  // If we're updating an existing booking, exclude it from the check
  if (bookingId) {
    query._id = { $ne: bookingId };
  }
  
  const existingBooking = await this.findOne(query);
  return !existingBooking; // Returns true if slot is available
};

module.exports = mongoose.model('Booking', BookingSchema);