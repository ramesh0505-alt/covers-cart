const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, hasRole } = require('../middlewares/authMiddleware');

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'DESIGNER'];

// Public reads (storefront)
router.get('/', bannerController.getBanners);

// Admin writes
router.post('/', verifyToken, hasRole(adminRoles), bannerController.createBanner);
router.put('/:id', verifyToken, hasRole(adminRoles), bannerController.updateBanner);
router.delete('/:id', verifyToken, hasRole(adminRoles), bannerController.deleteBanner);

module.exports = router;

