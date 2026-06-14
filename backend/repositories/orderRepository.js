const db = require('../models/db');

class OrderRepository {
  async create(orderData, items) {
    if (db.prisma) {
      try {
        return await db.prisma.order.create({
          data: {
            ...orderData,
            items: {
              create: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                device: item.device || 'Default',
                material: item.material || 'Silicone'
              }))
            }
          },
          include: { items: true }
        });
      } catch (e) {
        console.error("Repository: db.prisma order creation failed, using fallback.", e.message);
      }
    }
    const newOrder = {
      id: `ord-${Date.now()}`,
      ...orderData,
      status: 'PENDING',
      createdAt: new Date(),
      items: items.map(item => ({ id: `item-${Math.random()}`, ...item }))
    };
    db.fallbackOrders.push(newOrder);
    return newOrder;
  }

  async findById(orderId) {
    if (db.prisma) {
      try {
        return await db.prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        });
      } catch (e) {
        console.error("Repository: db.prisma find order failed.", e.message);
      }
    }
    return db.fallbackOrders.find(o => o.id === orderId) || null;
  }

  async updateStatus(orderId, status) {
    if (db.prisma) {
      try {
        return await db.prisma.order.update({
          where: { id: orderId },
          data: { status }
        });
      } catch (e) {
        console.error("Repository: db.prisma status update failed.", e.message);
      }
    }
    const order = db.fallbackOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    if (db.prisma) {
      try {
        return await db.prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus }
        });
      } catch (e) {
        console.error("Repository: db.prisma payment status update failed.", e.message);
      }
    }
    const order = db.fallbackOrders.find(o => o.id === orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      return order;
    }
    return null;
  }
}

module.exports = new OrderRepository();
