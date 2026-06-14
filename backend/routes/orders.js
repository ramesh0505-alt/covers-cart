const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { validateOrder } = require('../middlewares/validateMiddleware');

router.post('/', verifyToken, validateOrder, orderController.createOrder);
router.get('/', verifyToken, orderController.getMyOrders);
router.get('/all', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id', verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;


