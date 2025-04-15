const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  clubName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  clubCategory: {
    type: String,
    required: true
  },
  firebaseUid: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['club_admin', 'admin', 'user'],
    default: 'club_admin'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);