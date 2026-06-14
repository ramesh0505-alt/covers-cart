const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { validateReview } = require('../middlewares/validateMiddleware');

// Public reads
router.get('/', reviewController.getReviews);

// Authenticated write
router.post('/', verifyToken, validateReview, reviewController.createReview);

// Admin-only moderation
router.put('/:id/approve', verifyToken, isAdmin, reviewController.approveReview);
router.delete('/:id', verifyToken, isAdmin, reviewController.deleteReview);

module.exports = router;


