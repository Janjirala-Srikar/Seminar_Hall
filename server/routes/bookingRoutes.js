// routes/bookingRoutes.js - API Routes
const express = require('express');
const router = express.Router();
const Booking = require('../Models/BookingReq');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ start: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// CREATE a new booking
router.post('/post', async (req, res) => {
  const booking = new Booking({
    title: req.body.title,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    bookedBy: req.body.bookedBy || 'Anonymous',
    description: req.body.description || '',
    isConfirmed: true
  });

  try {
    // Check if the slot is available
    const isAvailable = await Booking.checkAvailability(booking.start, booking.end);
    
    if (!isAvailable) {
      return res.status(409).json({ message: 'The selected time slot is already booked' });
    }
    
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// UPDATE isConfirmed field by booking ID
router.put('/:id', async (req, res) => {
  const bookingId = req.params.id;
  const { isConfirmed } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.isConfirmed = isConfirmed;
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;