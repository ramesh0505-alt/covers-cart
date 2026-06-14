/**
 * CoversCart — Input Validation Middleware
 *
 * Validates and sanitises request bodies before they reach controllers.
 * Uses no external validation packages — pure JS with clear error messages.
 */

'use strict';

// ── Sanitiser ─────────────────────────────────────────────────────────────────
const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitiseString = (val, maxLen = 500) => {
  if (val === undefined || val === null) return val;
  const str = String(val).trim();
  return escapeHtml(str.slice(0, maxLen));
};

const sanitiseBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const clean = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === 'string') {
      clean[k] = sanitiseString(v);
    } else if (Array.isArray(v)) {
      clean[k] = v.map(item => (typeof item === 'string' ? sanitiseString(item) : item));
    } else {
      clean[k] = v;
    }
  }
  return clean;
};

// ── Generic field checker ─────────────────────────────────────────────────────
const required = (body, fields) => {
  const errors = [];
  for (const field of fields) {
    const val = body[field];
    if (val === undefined || val === null || String(val).trim() === '') {
      errors.push(`'${field}' is required`);
    }
  }
  return errors;
};

const isPositiveNumber = (val) =>
  val !== null && val !== '' && typeof val !== 'boolean' && !Array.isArray(val) && !isNaN(val) && Number(val) > 0;
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val));
const isValidPhone = (val) => /^[0-9+\-\s()]{7,20}$/.test(String(val));

// ── Sanitise all incoming request bodies (applied globally) ───────────────────
exports.sanitiseInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitiseBody(req.body);
  }
  next();
};

// ── Auth validation ───────────────────────────────────────────────────────────
exports.validateRegister = (req, res, next) => {
  const errors = required(req.body, ['email', 'password']);
  const { email, password, name } = req.body;

  if (!errors.length) {
    if (!isValidEmail(email)) errors.push("'email' must be a valid email address");
    if (typeof password === 'string' && password.length < 6)
      errors.push("'password' must be at least 6 characters");
    if (name && String(name).length > 100)
      errors.push("'name' must be 100 characters or fewer");
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

exports.validateLogin = (req, res, next) => {
  const errors = required(req.body, ['email', 'password']);
  const { email } = req.body;

  if (!errors.length && !isValidEmail(email))
    errors.push("'email' must be a valid email address");

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Product validation ────────────────────────────────────────────────────────
exports.validateProduct = (req, res, next) => {
  const errors = required(req.body, ['title', 'price']);
  const { title, price, salePrice, stock, images } = req.body;

  if (!errors.length) {
    if (title && String(title).length > 200)
      errors.push("'title' must be 200 characters or fewer");
    if (price !== undefined && !isPositiveNumber(price))
      errors.push("'price' must be a positive number");
    if (salePrice !== undefined && salePrice !== null && !isPositiveNumber(salePrice))
      errors.push("'salePrice' must be a positive number");
    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0))
      errors.push("'stock' must be a non-negative integer");
    if (images !== undefined && !Array.isArray(images))
      errors.push("'images' must be an array");
    if (Array.isArray(images) && images.length > 20)
      errors.push("'images' must contain 20 or fewer entries");
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Order validation ──────────────────────────────────────────────────────────
exports.validateOrder = (req, res, next) => {
  const errors = required(req.body, ['items', 'shippingAddress', 'paymentMethod']);
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!errors.length) {
    if (!Array.isArray(items) || items.length === 0)
      errors.push("'items' must be a non-empty array");
    if (Array.isArray(items)) {
      items.forEach((item, i) => {
        if (!item.productId) errors.push(`items[${i}].productId is required`);
        if (!isPositiveNumber(item.quantity)) errors.push(`items[${i}].quantity must be a positive number`);
        if (!isPositiveNumber(item.price)) errors.push(`items[${i}].price must be a positive number`);
      });
    }
    if (Array.isArray(items) && items.length > 50)
      errors.push("'items' cannot exceed 50 products per order");
    if (shippingAddress && String(shippingAddress).length > 500)
      errors.push("'shippingAddress' must be 500 characters or fewer");
    const validPaymentMethods = ['CREDIT_CARD', 'COD', 'UPI', 'APPLEPAY', 'PAYPAL', 'RAZORPAY', 'WHATSAPP'];
    if (!validPaymentMethods.includes(String(paymentMethod).toUpperCase()))
      errors.push(`'paymentMethod' must be one of: ${validPaymentMethods.join(', ')}`);
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Address validation ────────────────────────────────────────────────────────
exports.validateAddress = (req, res, next) => {
  const errors = required(req.body, ['fullName', 'addressLine', 'city', 'state', 'postalCode']);
  const { fullName, phone, email, addressLine, city, state, postalCode } = req.body;

  if (!errors.length) {
    if (String(fullName).length > 100)
      errors.push("'fullName' must be 100 characters or fewer");
    if (phone && !isValidPhone(phone))
      errors.push("'phone' must be a valid phone number");
    if (email && !isValidEmail(email))
      errors.push("'email' must be a valid email address");
    if (String(addressLine).length > 300)
      errors.push("'addressLine' must be 300 characters or fewer");
    if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(String(postalCode)))
      errors.push("'postalCode' must be 3–10 alphanumeric characters");
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Review validation ─────────────────────────────────────────────────────────
exports.validateReview = (req, res, next) => {
  const errors = required(req.body, ['productId', 'rating']);
  const { rating, comment, reviewerName } = req.body;

  if (!errors.length) {
    const r = Number(rating);
    if (isNaN(r) || r < 1 || r > 5)
      errors.push("'rating' must be a number between 1 and 5");
    if (comment && String(comment).length > 2000)
      errors.push("'comment' must be 2000 characters or fewer");
    if (reviewerName && String(reviewerName).length > 100)
      errors.push("'reviewerName' must be 100 characters or fewer");
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Coupon validation ─────────────────────────────────────────────────────────
exports.validateCoupon = (req, res, next) => {
  const errors = required(req.body, ['code']);
  const { code } = req.body;

  if (!errors.length) {
    if (!/^[A-Za-z0-9_\-]{2,30}$/.test(String(code)))
      errors.push("'code' must be 2–30 alphanumeric characters");
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Category validation ───────────────────────────────────────────────────────
exports.validateCategory = (req, res, next) => {
  const errors = required(req.body, ['name', 'slug']);
  const { name, slug } = req.body;

  if (!errors.length) {
    if (String(name).length > 100)
      errors.push("'name' must be 100 characters or fewer");
    if (!/^[a-z0-9\-]{2,50}$/.test(String(slug)))
      errors.push("'slug' must be 2–50 lowercase alphanumeric characters or hyphens");
  }

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

// ── Payment validation ────────────────────────────────────────────────────────
exports.validateRazorpayOrder = (req, res, next) => {
  const errors = required(req.body, ['amount']);
  const { amount } = req.body;
  if (!errors.length && !isPositiveNumber(amount))
    errors.push("'amount' must be a positive number");
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

exports.validatePaymentVerify = (req, res, next) => {
  const errors = required(req.body, ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};
