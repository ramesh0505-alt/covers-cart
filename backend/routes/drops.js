const express = require('express');
const router = express.Router();
const controller = require('../controllers/dropsController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', controller.getAllDrops);
router.post('/', verifyToken, isAdmin, controller.createDrop);
router.patch('/:id/status', verifyToken, isAdmin, controller.updateDropStatus);
router.delete('/:id', verifyToken, isAdmin, controller.deleteDrop);

module.exports = router;
