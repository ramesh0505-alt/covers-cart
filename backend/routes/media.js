const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { verifyToken, hasRole } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Admin-only operations for Media Library
router.get('/', verifyToken, hasRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'DESIGNER']), mediaController.getMediaFiles);
router.post('/upload', verifyToken, hasRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'DESIGNER']), upload.single('file'), mediaController.uploadMediaFile);
router.post('/delete', verifyToken, hasRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER']), mediaController.deleteMediaFile);

module.exports = router;
