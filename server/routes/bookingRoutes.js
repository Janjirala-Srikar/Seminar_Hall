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
router.post('/book', async (req, res) => {
  const booking = new Booking({
    title: req.body.title,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    bookedBy: req.body.bookedBy || 'Anonymous',
    description: req.body.description || '',
    isConfirmed: false,
    status: 'pending',
    hall: req.body.hall || ''
  });

  try {
    // Check if the slot is available
    const isAvailable = await Booking.checkAvailability(booking.start, booking.end, booking.hall);

    if (!isAvailable) {
      return res.status(409).json({ message: 'The selected time slot is already booked' });
    }

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a booking by ID
router.put('/:id', async (req, res) => {
  const bookingId = req.params.id;
  
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'start', 'end', 'bookedBy', 'description', 'isConfirmed', 'status', 'hall'];
    
    // Only update fields that are provided in the request
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        // Convert date strings to Date objects
        if (field === 'start' || field === 'end') {
          booking[field] = new Date(req.body[field]);
        } else {
          booking[field] = req.body[field];
        }
      }
    });

    // If isConfirmed was updated, also update status accordingly
    if (req.body.isConfirmed !== undefined) {
      booking.status = req.body.isConfirmed ? 'approved' : 'rejected';
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// UPDATE booking status (confirm or reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'confirm' or 'reject'
    
    if (!action || !['confirm', 'reject'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid action. Must be "confirm" or "reject".' 
      });
    }
    
    // Define update based on action
    const updateData = action === 'confirm' 
      ? { status: 'approved', isConfirmed: true }
      : { status: 'rejected', isConfirmed: false };
    
    // Find and update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Booking ${action === 'confirm' ? 'confirmed' : 'rejected'} successfully`,
      data: updatedBooking
    });
    
  } catch (error) {
    console.error(`Error updating booking status: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating booking status',
      error: error.message
    });
  }
});

module.exports = router;