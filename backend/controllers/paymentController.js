'use strict';

const crypto = require('crypto');

/**
 * Creates a Razorpay order.
 *
 * In production (when RAZORPAY_KEY_ID is set): uses the real Razorpay SDK.
 * In demo/dev mode: returns a signed stub response for UI testing.
 */
exports.createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR', orderId } = req.body;

  // ── Production mode: real Razorpay SDK ─────────────────────────────────────
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('your_key')) {
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(Number(amount) * 100), // convert to paisa
        currency,
        receipt: orderId ? `receipt_${orderId}` : `receipt_${Date.now()}`,
        notes: { source: 'CoversCart Online' },
      });

      return res.status(201).json(order);
    } catch (err) {
      console.error('[PaymentController] Razorpay order creation failed:', err.message);
      return res.status(502).json({
        error: 'Payment gateway error. Please try again.',
      });
    }
  }

  // ── Demo / dev mode: stub response ─────────────────────────────────────────
  return res.status(201).json({
    id: `rzp_order_demo_${Date.now()}`,
    amount: Math.round(Number(amount) * 100),
    currency,
    status: 'created',
    _demo: true,
  });
};

/**
 * Verifies a Razorpay payment signature.
 *
 * In production: validates HMAC-SHA256 signature.
 * In demo mode: accepts any payload and returns success.
 */
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // ── Production mode: real signature verification ───────────────────────────
  if (process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_SECRET.includes('your_key')) {
    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(razorpay_signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Payment signature verification failed.' });
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully.',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } catch (err) {
      console.error('[PaymentController] Signature verification error:', err.message);
      return res.status(400).json({ error: 'Payment verification failed. Invalid signature format.' });
    }
  }

  // ── Demo / dev mode: always succeed ───────────────────────────────────────
  return res.json({
    success: true,
    message: 'Payment verified (demo mode).',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    _demo: true,
  });
};
