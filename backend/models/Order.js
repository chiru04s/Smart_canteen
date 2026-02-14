const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  foodItemId: { type: String, required: true },
  name:       { type: String, required: true },
  price:      { type: Number, required: true },
  quantity:   { type: Number, required: true },
  image_path: { type: String, default: null }
});

const orderSchema = new mongoose.Schema({
  userId:     { type: String, required: true },   // identifier (roll no / staff ID)
  userName:   { type: String, required: true },
  items:      { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  catererId:  { type: String, default: null },    // assigned by admin
  catererName:{ type: String, default: null },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  note: { type: String, default: '' }             // admin rejection reason
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
