const mongoose = require('mongoose');

const catererSchema = new mongoose.Schema({
  caterer_id: { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  password:   { type: String, required: true, default: 'caterer123' },
  phone:      { type: String, default: '' },
  totalEarnings: { type: Number, default: 0 },
  isAvailable:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Caterer', catererSchema);
