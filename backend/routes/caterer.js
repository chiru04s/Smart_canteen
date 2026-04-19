const express = require('express');
const router  = express.Router();
const {
  catererLogin, getCatererOrders, updateOrderStatus, toggleAvailability, getEarnings
} = require('../controllers/catererAuth');

router.post('/login',                              catererLogin);         // POST /caterer/login
router.get('/:caterer_id/orders',                  getCatererOrders);     // GET  /caterer/:id/orders
router.patch('/orders/:orderId/status',            updateOrderStatus);    // PATCH /caterer/orders/:id/status
router.patch('/:caterer_id/availability',          toggleAvailability);   // PATCH /caterer/:id/availability
router.get('/:caterer_id/earnings',                getEarnings);          // GET  /caterer/:id/earnings

module.exports = router;
