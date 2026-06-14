const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateAddress } = require('../middlewares/validateMiddleware');

router.get('/', verifyToken, addressController.getAddresses);
router.post('/', verifyToken, validateAddress, addressController.addAddress);
router.delete('/:id', verifyToken, addressController.deleteAddress);

module.exports = router;


