const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  acceptOrder,
  rejectOrder
} = require('../controllers/order');

// User routes
router.post('/', placeOrder);                        // POST   /orders         — place order
router.get('/user/:userId', getUserOrders);          // GET    /orders/user/:id — user's orders

// Admin routes
router.get('/admin/all', getAllOrders);              // GET    /orders/admin/all
router.patch('/:orderId/accept', acceptOrder);       // PATCH  /orders/:id/accept
router.patch('/:orderId/reject', rejectOrder);       // PATCH  /orders/:id/reject

module.exports = router;
