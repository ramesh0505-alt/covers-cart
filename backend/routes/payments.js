const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateRazorpayOrder, validatePaymentVerify } = require('../middlewares/validateMiddleware');

router.post('/razorpay-order', verifyToken, validateRazorpayOrder, paymentController.createRazorpayOrder);
router.post('/verify', verifyToken, validatePaymentVerify, paymentController.verifyPayment);

module.exports = router;


