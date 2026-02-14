const Order = require('../models/Order');
const Caterer = require('../models/Caterer');

// ── USER: Place an order ──────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  const { userId, userName, items, totalPrice } = req.body;

  if (!userId || !userName || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing order data' });
  }

  try {
    const newOrder = new Order({ userId, userName, items, totalPrice });
    await newOrder.save();
    return res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    return res.status(500).json({ success: false, message: 'Error placing order' });
  }
};

// ── USER: Get orders for a specific user ──────────────────────────────────────
const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// ── ADMIN: Get ALL orders ─────────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// ── ADMIN: Accept an order (assign caterer) ───────────────────────────────────
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { catererId } = req.body;

  if (!catererId) {
    return res.status(400).json({ success: false, message: 'Please select a caterer' });
  }

  try {
    const caterer = await Caterer.findOne({ caterer_id: catererId });
    if (!caterer) {
      return res.status(404).json({ success: false, message: 'Caterer not found' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'accepted', catererId: caterer.caterer_id, catererName: caterer.name, note: '' },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    return res.status(200).json({ success: true, message: 'Order accepted', order });
  } catch (err) {
    console.error('Accept error:', err);
    return res.status(500).json({ success: false, message: 'Error accepting order' });
  }
};

// ── ADMIN: Reject an order ────────────────────────────────────────────────────
const rejectOrder = async (req, res) => {
  const { orderId } = req.params;
  const { note } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'rejected', note: note || 'Order rejected by admin', catererId: null, catererName: null },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    return res.status(200).json({ success: true, message: 'Order rejected', order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error rejecting order' });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, acceptOrder, rejectOrder };
