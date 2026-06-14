const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../models/db');

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    if (db.prisma) {
      try {
        newUser = await db.prisma.user.create({
          data: { email, password: hashedPassword, name }
        });
      } catch (dbErr) {
        console.log("Prisma registration error, falling back to memory:", dbErr.message);
        newUser = { id: `user-${Date.now()}`, email, password: hashedPassword, name, role: 'USER' };
        db.fallbackUsers.push(newUser);
      }
    } else {
      newUser = { id: `user-${Date.now()}`, email, password: hashedPassword, name, role: 'USER' };
      db.fallbackUsers.push(newUser);
    }
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, db.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { email: newUser.email, name: newUser.name, role: newUser.role } });
  } catch (e) {
    res.status(500).json({ error: e.message || "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    if (db.prisma) {
      try {
        user = await db.prisma.user.findUnique({ where: { email } });
      } catch (dbErr) {
        console.log("Prisma login query error, falling back to memory:", dbErr.message);
        user = db.fallbackUsers.find(u => u.email === email);
      }
    } else {
      user = db.fallbackUsers.find(u => u.email === email);
    }
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    const role = (user.role || '').toUpperCase();
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'DESIGNER'];
    if (adminRoles.includes(role)) {
      return res.status(403).json({ error: 'Admin accounts must sign in via the admin portal.' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, db.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { email, name } = req.body;
  try {
    let user;
    if (db.prisma) {
      try {
        user = await db.prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await db.prisma.user.create({
            data: { email, password: await bcrypt.hash('google_auth_random_pw', 10), name, role: 'USER' }
          });
        }
      } catch (dbErr) {
        console.log("Prisma google login error, falling back to memory:", dbErr.message);
        user = db.fallbackUsers.find(u => u.email === email);
        if (!user) {
          user = { id: `user-${Date.now()}`, email, password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), name, role: 'USER' };
          db.fallbackUsers.push(user);
        }
      }
    } else {
      user = db.fallbackUsers.find(u => u.email === email);
      if (!user) {
        user = { id: `user-${Date.now()}`, email, password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), name, role: 'USER' };
        db.fallbackUsers.push(user);
      }
    }
    const token = jwt.sign({ id: user.id, role: user.role }, db.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Dedicated Admin Login — verifies role before issuing token
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    if (db.prisma) {
      try {
        user = await db.prisma.user.findUnique({ where: { email } });
      } catch (dbErr) {
        console.log("Prisma admin login query error, falling back to memory:", dbErr.message);
        user = db.fallbackUsers.find(u => u.email === email);
      }
    } else {
      user = db.fallbackUsers.find(u => u.email === email);
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    const role = (user.role || '').toUpperCase();
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'DESIGNER'];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Access denied. Admin credentials required.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, db.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/** Validate active session and return current user profile */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session.' });
    }

    let user;
    if (db.prisma) {
      try {
        user = await db.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true, role: true },
        });
      } catch (dbErr) {
        console.log('Prisma getMe error, falling back to memory:', dbErr.message);
        user = db.fallbackUsers.find(u => u.id === userId);
      }
    } else {
      user = db.fallbackUsers.find(u => u.id === userId);
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
