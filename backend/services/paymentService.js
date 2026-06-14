const crypto = require('crypto');
const orderService = require('./orderService');

class PaymentService {
  verifySignature(orderId, paymentId, signature, keySecret) {
    console.log(`PaymentService: Verifying signature for payment ${paymentId}`);
    
    // In production, signature matches: HMAC-SHA256(order_id + "|" + payment_id, secret)
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
      
    const matches = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );

    if (!matches) {
      throw new Error("Razorpay signature mismatch validation failure.");
    }
    return true;
  }

  async completePayment(orderId, paymentId, signature, keySecret) {
    this.verifySignature(orderId, paymentId, signature, keySecret);
    
    // Transition order to paid
    await orderService.markOrderPaid(orderId);
    return true;
  }
}

module.exports = new PaymentService();
