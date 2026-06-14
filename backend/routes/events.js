const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, hasRole } = require('../middlewares/authMiddleware');

const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'];

// Public reads
router.get('/', eventController.getEvents);
router.get('/drops', eventController.getLimitedDrops);

// Admin writes
router.post('/', verifyToken, hasRole(adminRoles), eventController.createEvent);
router.put('/:id', verifyToken, hasRole(adminRoles), eventController.updateEvent);
router.delete('/:id', verifyToken, hasRole(adminRoles), eventController.deleteEvent);

router.post('/drops', verifyToken, hasRole(adminRoles), eventController.createLimitedDrop);

module.exports = router;
