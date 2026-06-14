const db = require('../models/db');

exports.getBanners = async (req, res) => {
  const { location } = req.query;
  try {
    if (db.prisma) {
      const banners = await db.prisma.banner.findMany({
        where: location ? { location } : undefined,
        orderBy: { createdAt: 'desc' }
      });
      return res.json(banners);
    }
    res.json(db.fallbackBanners || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBanner = async (req, res) => {
  const { location, image, heading, description, ctaText, link, startDate, endDate, active } = req.body;
  try {
    if (db.prisma) {
      const banner = await db.prisma.banner.create({
        data: {
          location,
          image,
          heading,
          description,
          ctaText,
          link,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          active
        }
      });
      return res.status(201).json(banner);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  const { location, image, heading, description, ctaText, link, startDate, endDate, active } = req.body;
  try {
    if (db.prisma) {
      const banner = await db.prisma.banner.update({
        where: { id },
        data: {
          location,
          image,
          heading,
          description,
          ctaText,
          link,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          active
        }
      });
      return res.json(banner);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      await db.prisma.banner.delete({ where: { id } });
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
