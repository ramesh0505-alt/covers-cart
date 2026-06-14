const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

const { verifyToken, hasRole } = require('../middlewares/authMiddleware');

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'];

router.get('/', categoryController.getCategories);
router.post('/reorder', verifyToken, hasRole(adminRoles), categoryController.reorderCategories);
router.post('/', verifyToken, hasRole(adminRoles), categoryController.createCategory);
router.put('/:id', verifyToken, hasRole(adminRoles), categoryController.updateCategory);
router.delete('/:id', verifyToken, hasRole(adminRoles), categoryController.deleteCategory);

module.exports = router;
