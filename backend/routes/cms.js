const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Public read (storefront needs CMS settings for banners, homepage)
router.get('/settings', cmsController.getCmsSettings);

// Admin writes
router.post('/settings', verifyToken, isAdmin, cmsController.updateCmsSettings);

// Homepage Builder
router.get('/homepage-sections', cmsController.getHomepageSections);
router.post('/homepage-sections', verifyToken, isAdmin, cmsController.updateHomepageSections);

module.exports = router;


