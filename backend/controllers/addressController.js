const db = require('../models/db');

exports.getAddresses = (req, res) => {
  res.json(db.fallbackAddresses);
};

exports.addAddress = (req, res) => {
  const { fullName, phone, email, addressLine, landmark, city, state, postalCode } = req.body;
  const newAddr = { 
    id: `addr-${Date.now()}`, 
    fullName, 
    phone, 
    email, 
    addressLine, 
    landmark, 
    city, 
    state, 
    postalCode 
  };
  db.fallbackAddresses.push(newAddr);
  res.status(201).json(newAddr);
};

exports.deleteAddress = (req, res) => {
  db.fallbackAddresses = db.fallbackAddresses.filter(a => a.id !== req.params.id);
  res.json({ success: true });
};
