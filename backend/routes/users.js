const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.post('/:id/points', verifyToken, isAdmin, userController.grantPoints);
router.post('/:id/suspend', verifyToken, isAdmin, userController.suspendCustomer);

module.exports = router;
