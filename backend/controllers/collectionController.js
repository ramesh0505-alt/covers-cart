const db = require('../models/db');

exports.getCollections = async (req, res) => {
  try {
    if (db.prisma) {
      const collections = await db.prisma.collection.findMany({
        include: { products: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(collections);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCollection = async (req, res) => {
  const { name, slug, description, image, isFeatured, startDate, endDate, active, productIds } = req.body;
  try {
    if (db.prisma) {
      const collection = await db.prisma.collection.create({
        data: {
          name, slug, description, image, isFeatured, active,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          products: {
            connect: (productIds || []).map(id => ({ id }))
          }
        },
        include: { products: true }
      });
      return res.status(201).json(collection);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCollection = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, image, isFeatured, startDate, endDate, active, productIds } = req.body;
  try {
    if (db.prisma) {
      const collection = await db.prisma.collection.update({
        where: { id },
        data: {
          name, slug, description, image, isFeatured, active,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          products: {
            set: (productIds || []).map(pid => ({ id: pid }))
          }
        },
        include: { products: true }
      });
      return res.json(collection);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCollection = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      await db.prisma.collection.delete({ where: { id } });
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
