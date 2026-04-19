const Order   = require('../models/Order');
const Caterer = require('../models/Caterer');

// ── USER: Place an order ──────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  const { userId, userName, items, totalPrice, paymentMode } = req.body;
  if (!userId || !userName || !items || items.length === 0)
    return res.status(400).json({ success: false, message: 'Missing order data' });

  try {
    const newOrder = new Order({
      userId, userName, items, totalPrice,
      paymentMode: paymentMode || 'cash'
    });
    await newOrder.save();
    return res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (err) {
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

// ── ADMIN: Accept order + assign caterer ──────────────────────────────────────
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { catererId } = req.body;
  if (!catererId)
    return res.status(400).json({ success: false, message: 'Please select a caterer' });

  try {
    const caterer = await Caterer.findOne({ caterer_id: catererId });
    if (!caterer) return res.status(404).json({ success: false, message: 'Caterer not found' });

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'accepted', catererId: caterer.caterer_id, catererName: caterer.name, note: '' },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.status(200).json({ success: true, message: 'Order accepted', order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error accepting order' });
  }
};

// ── ADMIN: Reject order ───────────────────────────────────────────────────────
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

// ── ADMIN: Sales stats ────────────────────────────────────────────────────────
const getSalesStats = async (req, res) => {
  try {
    const all = await Order.find({});
    const delivered = all.filter(o => o.status === 'delivered');
    const today = new Date(); today.setHours(0,0,0,0);

    const todayDelivered = delivered.filter(o => new Date(o.deliveredAt) >= today);
    const totalRevenue   = delivered.reduce((s,o) => s + o.totalPrice, 0);
    const todayRevenue   = todayDelivered.reduce((s,o) => s + o.totalPrice, 0);

    const byPayment = { cash: 0, upi: 0, wallet: 0 };
    delivered.forEach(o => { byPayment[o.paymentMode] = (byPayment[o.paymentMode]||0) + o.totalPrice; });

    const caterers = await Caterer.find({});

    return res.status(200).json({
      success: true,
      data: {
        totalOrders: all.length,
        deliveredOrders: delivered.length,
        pendingOrders: all.filter(o=>o.status==='pending').length,
        totalRevenue,
        todayRevenue,
        todayOrders: todayDelivered.length,
        byPayment,
        totalCaterers: caterers.length,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, acceptOrder, rejectOrder, getSalesStats };
