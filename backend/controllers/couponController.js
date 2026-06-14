const db = require('../models/db');

exports.getCoupons = async (req, res) => {
  try {
    if (db.prisma) {
      const coupons = await db.prisma.coupon.findMany({
        orderBy: { expiryDate: 'desc' }
      });
      return res.json(coupons);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCoupon = async (req, res) => {
  const { code, discount, discountType, isActive, expiryDate, usageLimit } = req.body;
  try {
    if (db.prisma) {
      const coupon = await db.prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          discount: parseFloat(discount),
          discountType,
          isActive,
          expiryDate: new Date(expiryDate),
          usageLimit: usageLimit ? parseInt(usageLimit) : null
        }
      });
      return res.status(201).json(coupon);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { code, discount, discountType, isActive, expiryDate, usageLimit } = req.body;
  try {
    if (db.prisma) {
      const coupon = await db.prisma.coupon.update({
        where: { id },
        data: {
          code: code ? code.toUpperCase() : undefined,
          discount: discount ? parseFloat(discount) : undefined,
          discountType,
          isActive,
          expiryDate: expiryDate ? new Date(expiryDate) : undefined,
          usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : undefined
        }
      });
      return res.json(coupon);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      await db.prisma.coupon.delete({ where: { id } });
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.validateCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    let coupon;
    if (db.prisma) {
      try {
        coupon = await db.prisma.coupon.findFirst({
          where: { code: { equals: code, mode: 'insensitive' }, isActive: true }
        });
        
        // Validate expiry and limits
        if (coupon) {
          if (new Date() > new Date(coupon.expiryDate)) coupon = null;
          else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) coupon = null;
        }

      } catch (dbErr) {
        console.log("Prisma database error, falling back to memory:", dbErr.message);
        if (code && code.toUpperCase() === 'COVERS10') {
          coupon = { code: 'COVERS10', discount: 10, discountType: 'PERCENTAGE', isActive: true };
        }
      }
    } else {
      if (code && code.toUpperCase() === 'COVERS10') {
        coupon = { code: 'COVERS10', discount: 10, discountType: 'PERCENTAGE', isActive: true };
      }
    }
    
    if (!coupon) {
      return res.status(400).json({ error: "Invalid or expired coupon code" });
    }
    res.json({ code: coupon.code, discount: coupon.discount, discountType: coupon.discountType });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
