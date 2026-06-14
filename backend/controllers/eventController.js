const db = require('../models/db');

// Events (Sales, Launches)
exports.getEvents = async (req, res) => {
  try {
    if (db.prisma) {
      const events = await db.prisma.event.findMany({
        include: { products: true },
        orderBy: { startDate: 'desc' }
      });
      return res.json(events);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  const { name, type, description, bannerImage, startDate, endDate, discountRules, active } = req.body;
  try {
    if (db.prisma) {
      const event = await db.prisma.event.create({
        data: {
          name, type, description, bannerImage,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          discountRules: discountRules ? JSON.stringify(discountRules) : null,
          active
        }
      });
      return res.status(201).json(event);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, type, description, bannerImage, startDate, endDate, discountRules, active } = req.body;
  try {
    if (db.prisma) {
      const event = await db.prisma.event.update({
        where: { id },
        data: {
          name, type, description, bannerImage,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          discountRules: discountRules ? JSON.stringify(discountRules) : undefined,
          active
        }
      });
      return res.json(event);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      await db.prisma.event.delete({ where: { id } });
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Limited Drops
exports.getLimitedDrops = async (req, res) => {
  try {
    if (db.prisma) {
      const drops = await db.prisma.limitedDrop.findMany({
        include: { product: true },
        orderBy: { launchDate: 'desc' }
      });
      return res.json(drops);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLimitedDrop = async (req, res) => {
  const { productId, launchDate, expiryDate, totalQty, artworkUrl } = req.body;
  try {
    if (db.prisma) {
      const drop = await db.prisma.limitedDrop.create({
        data: {
          productId,
          launchDate: new Date(launchDate),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          totalQty: parseInt(totalQty),
          artworkUrl
        }
      });
      return res.status(201).json(drop);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
