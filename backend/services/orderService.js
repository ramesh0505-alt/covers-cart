const orderRepository = require('../repositories/orderRepository');
const inventoryService = require('./inventoryService');

class OrderService {
  async createOrder(userId, items, shippingAddress, paymentMethod) {
    console.log("OrderService: Initiating Order Creation Workflow");

    // 1. Validate items
    if (!items || items.length === 0) {
      throw new Error("Cannot place an order with empty items list.");
    }

    // 2. Validate Inventory
    await inventoryService.reserveStock(items);

    // 3. Compute total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 4. Create order record
    const orderData = {
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'WHATSAPP' ? 'Pending Payment' : 'PENDING',
      status: paymentMethod === 'WHATSAPP' ? 'Pending Payment' : 'PENDING'
    };


    const newOrder = await orderRepository.create(orderData, items);
    console.log(`OrderService: Order created successfully with ID: ${newOrder.id}`);

    // If Cash on Delivery, deduct stock instantly and mark processing
    if (paymentMethod === 'COD') {
      await inventoryService.deductStock(items);
      await orderRepository.updateStatus(newOrder.id, 'PROCESSING');
    }

    return newOrder;
  }

  async markOrderPaid(orderId) {
    console.log(`OrderService: Processing payment completion for Order ${orderId}`);
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // 1. Update order payment status
    await orderRepository.updatePaymentStatus(orderId, 'PAID');
    await orderRepository.updateStatus(orderId, 'PROCESSING');

    // 2. Deduct physical stock
    await inventoryService.deductStock(order.items);

    console.log(`OrderService: Order ${orderId} successfully marked PAID`);
    return true;
  }
}

module.exports = new OrderService();
