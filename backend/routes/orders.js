const express = require('express');
const router  = express.Router();
const { placeOrder, getUserOrders, getAllOrders, acceptOrder, rejectOrder, getSalesStats } = require('../controllers/order');

router.post('/',                   placeOrder);
router.get('/user/:userId',        getUserOrders);
router.get('/admin/all',           getAllOrders);
router.get('/admin/stats',         getSalesStats);
router.patch('/:orderId/accept',   acceptOrder);
router.patch('/:orderId/reject',   rejectOrder);

module.exports = router;
