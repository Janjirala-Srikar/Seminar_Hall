const express = require('express');
const router = express.Router();
const Club = require('../Models/Club');

// Create a new club
router.post('/', async (req, res) => {
  try {
    // Create a new club with status set to false
    const newClub = new Club({
      ...req.body,
      status: false
    });

    // Save to database
    const savedClub = await newClub.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Club registered successfully',
      data: savedClub 
    });
  } catch (error) {
    console.error('Error saving club:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to register club',
      error: error.message 
    });
  }
});

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.status(200).json({ success: true, data: clubs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;