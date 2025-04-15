const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Create user endpoint
router.post('/create', async (req, res) => {
  try {
    const { email, clubName, phoneNumber, clubCategory, firebaseUid, role, status } = req.body;
    
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Update existing user with new information
      existingUser.clubName = clubName;
      existingUser.phoneNumber = phoneNumber;
      existingUser.clubCategory = clubCategory;
      if (firebaseUid) existingUser.firebaseUid = firebaseUid;
      existingUser.role = role;
      existingUser.status = status;
      
      const updatedUser = await existingUser.save();
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    }
    
    // Create new user if they don't exist
    const newUser = new User({
      email,
      clubName,
      phoneNumber,
      clubCategory,
      firebaseUid,
      role,
      status
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while creating the user'
    });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching users'
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching the user'
    });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching the user'
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while updating the user'
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while deleting the user'
    });
  }
});

module.exports = router;