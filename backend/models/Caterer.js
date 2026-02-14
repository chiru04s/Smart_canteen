const mongoose = require('mongoose');

const catererSchema = new mongoose.Schema({
  caterer_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Caterer', catererSchema);
