const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  AdminId: {
    type: String,
    required: true,
    unique: true
  },
  AdminPassword: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
