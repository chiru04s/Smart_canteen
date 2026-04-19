const jwt = require('jsonwebtoken');
const Caterer = require('../models/Caterer');
const Order   = require('../models/Order');

const JWT_SECRET = 'caterer_sac_secret';

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const catererLogin = async (req, res) => {
  const { caterer_id, password } = req.body;
  if (!caterer_id || !password)
    return res.status(400).json({ success: false, message: 'ID and password required' });

  try {
    const caterer = await Caterer.findOne({ caterer_id });
    if (!caterer || caterer.password !== password)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ caterer_id, role: 'caterer' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({
      success: true, token,
      caterer: { caterer_id: caterer.caterer_id, name: caterer.name, totalEarnings: caterer.totalEarnings }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET ASSIGNED ORDERS ───────────────────────────────────────────────────────
const getCatererOrders = async (req, res) => {
  const { caterer_id } = req.params;
  try {
    const orders = await Order.find({ catererId: caterer_id })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// ── UPDATE ORDER STATUS (caterer actions) ─────────────────────────────────────
// Caterer can move: accepted → preparing → ready → delivered
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowed = ['preparing', 'ready', 'delivered'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  try {
    const updateData = { status };
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // If delivered, add earnings to caterer
    if (status === 'delivered') {
      // Caterer earns 10% of order value as commission
      const commission = Math.round(order.totalPrice * 0.10);
      await Caterer.findOneAndUpdate(
        { caterer_id: order.catererId },
        { $inc: { totalEarnings: commission } }
      );
    }

    return res.status(200).json({ success: true, message: `Order marked as ${status}`, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating order' });
  }
};

// ── TOGGLE AVAILABILITY ───────────────────────────────────────────────────────
const toggleAvailability = async (req, res) => {
  const { caterer_id } = req.params;
  try {
    const caterer = await Caterer.findOne({ caterer_id });
    if (!caterer) return res.status(404).json({ success: false, message: 'Not found' });
    caterer.isAvailable = !caterer.isAvailable;
    await caterer.save();
    return res.json({ success: true, isAvailable: caterer.isAvailable });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── EARNINGS SUMMARY ──────────────────────────────────────────────────────────
const getEarnings = async (req, res) => {
  const { caterer_id } = req.params;
  try {
    const caterer = await Caterer.findOne({ caterer_id });
    if (!caterer) return res.status(404).json({ success: false, message: 'Not found' });

    const delivered = await Order.find({ catererId: caterer_id, status: 'delivered' });
    const today = new Date(); today.setHours(0,0,0,0);
    const todayOrders = delivered.filter(o => new Date(o.deliveredAt) >= today);
    const todayEarnings = todayOrders.reduce((s,o) => s + Math.round(o.totalPrice * 0.10), 0);

    return res.json({
      success: true,
      data: {
        totalEarnings: caterer.totalEarnings,
        todayEarnings,
        todayOrders: todayOrders.length,
        totalOrders: delivered.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { catererLogin, getCatererOrders, updateOrderStatus, toggleAvailability, getEarnings };
