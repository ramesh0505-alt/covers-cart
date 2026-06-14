const db = require('../models/db');

let fallbackDrops = [];

exports.getAllDrops = async (req, res) => {
  try {
    if (db.prisma) {
      try {
        const drops = await db.prisma.limitedDrop.findMany({
          orderBy: { createdAt: 'desc' },
          include: { product: true }
        });
        return res.json(drops);
      } catch (dbErr) {
        console.log("Prisma drops fetch error, falling back to memory:", dbErr.message);
      }
    }
    res.json(fallbackDrops);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createDrop = async (req, res) => {
  const { title, description, releaseDate, endDropDate, productId, stockLimit } = req.body;
  try {
    let newDrop;
    if (db.prisma) {
      try {
        newDrop = await db.prisma.limitedDrop.create({
          data: {
            title,
            description,
            releaseDate: new Date(releaseDate),
            endDropDate: new Date(endDropDate),
            productId,
            stockLimit: parseInt(stockLimit),
            status: 'Upcoming'
          }
        });
        return res.status(201).json(newDrop);
      } catch (dbErr) {
        console.log("Prisma create drop error:", dbErr.message);
      }
    }
    
    newDrop = {
      id: `drop-${Date.now()}`,
      title,
      description,
      releaseDate: new Date(releaseDate),
      endDropDate: new Date(endDropDate),
      productId,
      stockLimit: parseInt(stockLimit),
      status: 'Upcoming',
      createdAt: new Date().toISOString()
    };
    fallbackDrops.push(newDrop);
    res.status(201).json(newDrop);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateDropStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'Active', 'Archived'
  try {
    if (db.prisma) {
      try {
        const updated = await db.prisma.limitedDrop.update({
          where: { id },
          data: { status }
        });
        return res.json(updated);
      } catch (dbErr) {
        console.log("Prisma update drop status error:", dbErr.message);
      }
    }
    
    const idx = fallbackDrops.findIndex(d => d.id === id);
    if (idx !== -1) {
      fallbackDrops[idx].status = status;
      return res.json(fallbackDrops[idx]);
    }
    res.status(404).json({ error: 'Drop not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteDrop = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      try {
        await db.prisma.limitedDrop.delete({ where: { id } });
        return res.json({ success: true });
      } catch (dbErr) {
        console.log("Prisma delete drop error:", dbErr.message);
      }
    }
    fallbackDrops = fallbackDrops.filter(d => d.id !== id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
