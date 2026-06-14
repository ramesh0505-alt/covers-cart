const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validateMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/google', authController.googleLogin);
// Dedicated admin login — separate from customer login
router.post('/admin/login', validateLogin, authController.adminLogin);
// Session validation for both storefront and admin portal
router.get('/me', verifyToken, authController.getMe);

module.exports = router;

