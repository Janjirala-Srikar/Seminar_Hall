const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  facultyAdvisorName: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  departmentAffiliation: {
    type: String,
    required: true,
    trim: true
  },
  clubCategory: {
    type: String,
    required: true,
    trim: true
  },
  establishedDate: {
    type: Date,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Club', clubSchema);