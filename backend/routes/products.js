const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { validateProduct } = require('../middlewares/validateMiddleware');

// Public reads
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only writes
router.post('/', verifyToken, isAdmin, validateProduct, productController.createProduct);
router.post('/bulk-update', verifyToken, isAdmin, productController.bulkUpdateProducts);
router.post('/bulk-delete', verifyToken, isAdmin, productController.bulkDeleteProducts);
router.put('/:id', verifyToken, isAdmin, validateProduct, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;


