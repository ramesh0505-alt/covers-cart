const db = require('../models/db');

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  try {
    let users;
    let total = 0;
    if (db.prisma) {
      total = await db.prisma.user.count();
      users = await db.prisma.user.findMany({ 
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true, createdAt: true } 
      });
    } else {
      total = db.fallbackUsers.length;
      users = db.fallbackUsers.slice(skip, skip + limit).map(u => ({ 
        id: u.id, 
        email: u.email, 
        name: u.name, 
        role: u.role, 
        createdAt: new Date() 
      }));
    }
    
    res.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
