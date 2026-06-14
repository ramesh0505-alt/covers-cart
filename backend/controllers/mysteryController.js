const db = require('../models/db');

exports.getTiers = async (req, res) => {
  try {
    if (db.prisma) {
      const tiers = await db.prisma.mysteryTier.findMany({
        include: {
          products: {
            include: { product: true }
          }
        },
        orderBy: { price: 'asc' }
      });
      return res.json(tiers);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTier = async (req, res) => {
  const { name, price, stock, active, products } = req.body; // products: [{ productId, probability }]
  try {
    if (db.prisma) {
      const tier = await db.prisma.mysteryTier.create({
        data: {
          name, price, stock, active,
          products: {
            create: (products || []).map(p => ({
              productId: p.productId,
              probability: p.probability
            }))
          }
        },
        include: { products: true }
      });
      return res.status(201).json(tier);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTier = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, active, products } = req.body;
  try {
    if (db.prisma) {
      // Simplest way: delete all existing pool products for this tier and recreate
      await db.prisma.mysteryPoolProduct.deleteMany({ where: { tierId: id } });

      const tier = await db.prisma.mysteryTier.update({
        where: { id },
        data: {
          name, price, stock, active,
          products: {
            create: (products || []).map(p => ({
              productId: p.productId,
              probability: p.probability
            }))
          }
        },
        include: { products: true }
      });
      return res.json(tier);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTier = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      await db.prisma.mysteryTier.delete({ where: { id } });
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
