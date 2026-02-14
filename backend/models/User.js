const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true   // roll no / staff ID must be unique
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'staff']  // only allowed values
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
