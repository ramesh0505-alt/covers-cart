const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { validateCoupon } = require('../middlewares/validateMiddleware');
const { verifyToken, hasRole } = require('../middlewares/authMiddleware');

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'];

// Public
router.post('/validate', validateCoupon, couponController.validateCoupon);

// Admin writes
router.get('/', verifyToken, hasRole(adminRoles), couponController.getCoupons);
router.post('/', verifyToken, hasRole(adminRoles), couponController.createCoupon);
router.put('/:id', verifyToken, hasRole(adminRoles), couponController.updateCoupon);
router.delete('/:id', verifyToken, hasRole(adminRoles), couponController.deleteCoupon);

module.exports = router;
