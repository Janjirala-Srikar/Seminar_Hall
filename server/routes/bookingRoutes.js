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

// GET bookings within a date range
router.get('/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    const bookings = await Booking.find({
      $or: [
        { start: { $gte: new Date(start), $lte: new Date(end) } },
        { end: { $gte: new Date(start), $lte: new Date(end) } },
        { start: { $lte: new Date(start) }, end: { $gte: new Date(end) } }
      ]
    }).sort({ start: 1 });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific booking
router.get('/:id', getBooking, (req, res) => {
  res.json(res.booking);
});

// CREATE a new booking
router.post('/', async (req, res) => {
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

// UPDATE a booking
router.patch('/:id', getBooking, async (req, res) => {
  if (req.body.title) res.booking.title = req.body.title;
  if (req.body.start) res.booking.start = new Date(req.body.start);
  if (req.body.end) res.booking.end = new Date(req.body.end);
  if (req.body.bookedBy) res.booking.bookedBy = req.body.bookedBy;
  if (req.body.description) res.booking.description = req.body.description;
  if (req.body.isConfirmed !== undefined) res.booking.isConfirmed = req.body.isConfirmed;

  try {
    // If dates are changed, check availability
    if (req.body.start || req.body.end) {
      const isAvailable = await Booking.checkAvailability(
        res.booking.start,
        res.booking.end,
        res.booking._id
      );
      
      if (!isAvailable) {
        return res.status(409).json({ message: 'The selected time slot conflicts with an existing booking' });
      }
    }
    
    const updatedBooking = await res.booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a booking
router.delete('/:id', getBooking, async (req, res) => {
  try {
    await res.booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a specific booking by ID
async function getBooking(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.booking = booking;
  next();
}

module.exports = router;