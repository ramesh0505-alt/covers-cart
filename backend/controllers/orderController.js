const orderService = require('../services/orderService');
const orderRepository = require('../repositories/orderRepository');

exports.createOrder = async (req, res) => {
  // Use userId from auth token (trusted) or fallback to body (for backward compat with mock mode)
  const userId = req.user?.id || req.body.userId;
  const { items, shippingAddress, paymentMethod } = req.body;
  try {
    const newOrder = await orderService.createOrder(userId, items, shippingAddress, paymentMethod);
    res.status(201).json(newOrder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/** Returns only the authenticated user's orders */
exports.getMyOrders = async (req, res) => {
  const userId = req.user?.id;
  try {
    const db = require('../models/db');
    let orders;
    if (db.prisma) {
      try {
        orders = await db.prisma.order.findMany({
          where: { userId },
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        orders = db.fallbackOrders.filter(o => o.userId === userId);
      }
    } else {
      orders = db.fallbackOrders.filter(o => o.userId === userId);
    }
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/** Admin: returns all orders with pagination */
exports.getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  try {
    let orders;
    let total = 0;
    const db = require('../models/db');
    if (db.prisma) {
      try {
        total = await db.prisma.order.count();
        orders = await db.prisma.order.findMany({ 
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: true } } } 
        });
      } catch (dbErr) {
        total = db.fallbackOrders.length;
        orders = db.fallbackOrders.slice(skip, skip + limit);
      }
    } else {
      total = db.fallbackOrders.length;
      orders = db.fallbackOrders.slice(skip, skip + limit);
    }
    
    res.json({
      data: orders,
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

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    let updatedOrder;
    if (status) {
      updatedOrder = await orderRepository.updateStatus(id, status);
    }
    if (paymentStatus) {
      updatedOrder = await orderRepository.updatePaymentStatus(id, paymentStatus);
      if (paymentStatus === 'PAID') {
        await orderService.markOrderPaid(id);
      }
    }
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


