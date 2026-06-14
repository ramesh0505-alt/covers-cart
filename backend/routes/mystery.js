const express = require('express');
const router = express.Router();
const mysteryController = require('../controllers/mysteryController');
const { verifyToken, hasRole } = require('../middlewares/authMiddleware');

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'];

// Public reads
router.get('/', mysteryController.getTiers);

// Admin writes
router.post('/', verifyToken, hasRole(adminRoles), mysteryController.createTier);
router.put('/:id', verifyToken, hasRole(adminRoles), mysteryController.updateTier);
router.delete('/:id', verifyToken, hasRole(adminRoles), mysteryController.deleteTier);

module.exports = router;
