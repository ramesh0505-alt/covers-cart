const db = require('../models/db');

exports.getCategories = async (req, res) => {
  try {
    let categories;
    if (db.prisma) {
      try {
        categories = await db.prisma.category.findMany({
          orderBy: { order: 'asc' }
        });
      } catch (dbErr) {
        console.log('Prisma categories error, using fallback:', dbErr.message);
        categories = db.fallbackCategories;
      }
    } else {
      categories = db.fallbackCategories;
    }
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, slug, description, image, bannerImage, seoTitle, seoDescription, active, isFeatured } = req.body;
  try {
    if (db.prisma) {
      // Find max order
      const lastCat = await db.prisma.category.findFirst({
        orderBy: { order: 'desc' }
      });
      const order = lastCat ? lastCat.order + 1 : 0;

      const category = await db.prisma.category.create({
        data: { 
          name, slug, description, image, bannerImage, seoTitle, seoDescription, active, isFeatured, order 
        }
      });
      return res.status(201).json(category);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, image, bannerImage, seoTitle, seoDescription, active, isFeatured } = req.body;
  try {
    if (db.prisma) {
      const category = await db.prisma.category.update({
        where: { id },
        data: { name, slug, description, image, bannerImage, seoTitle, seoDescription, active, isFeatured }
      });
      return res.json(category);
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      await db.prisma.category.delete({ where: { id } });
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorderCategories = async (req, res) => {
  const { orderedIds } = req.body; // Array of category IDs in the new order
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: "orderedIds must be an array" });

  try {
    if (db.prisma) {
      // Execute in a transaction
      await db.prisma.$transaction(
        orderedIds.map((id, index) => 
          db.prisma.category.update({
            where: { id },
            data: { order: index }
          })
        )
      );
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Database offline' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
