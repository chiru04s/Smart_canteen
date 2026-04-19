const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  foodItemId: { type: String, required: true },
  name:       { type: String, required: true },
  price:      { type: Number, required: true },
  quantity:   { type: Number, required: true },
  image_path: { type: String, default: null }
});

const orderSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  userName:    { type: String, required: true },
  items:       { type: [orderItemSchema], required: true },
  totalPrice:  { type: Number, required: true },
  paymentMode: { type: String, enum: ['cash', 'upi', 'wallet'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  catererId:   { type: String, default: null },
  catererName: { type: String, default: null },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'preparing', 'ready', 'delivered'],
    default: 'pending'
  },
  note:        { type: String, default: '' },
  deliveredAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
