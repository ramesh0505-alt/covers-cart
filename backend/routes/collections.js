const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { verifyToken, hasRole } = require('../middlewares/authMiddleware');

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'];

// Public reads
router.get('/', collectionController.getCollections);

// Admin writes
router.post('/', verifyToken, hasRole(adminRoles), collectionController.createCollection);
router.put('/:id', verifyToken, hasRole(adminRoles), collectionController.updateCollection);
router.delete('/:id', verifyToken, hasRole(adminRoles), collectionController.deleteCollection);

module.exports = router;
