const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');
require('dotenv').config();

// ── Environment Validation ──────────────────────────────────────────────────
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_SECRET', 'CLOUDINARY_URL'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error('❌ CRITICAL ERROR: Missing required environment variables:');
  missingEnvVars.forEach(key => console.error(`   - ${key}`));
  console.error('The server cannot start until these are configured in the .env file.');
  process.exit(1);
}

const app = express();

// ── Sentry Initialization ──────────────────────────────────────────────────
Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND || "https://placeholder@o0.ingest.sentry.io/0",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

if (Sentry.Handlers) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

const PORT = process.env.PORT || 5000;

// ── Security Headers ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS — restrict to frontend origin ─────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://coverscart.com',
  'https://www.coverscart.com',
  'https://admin.coverscart.com',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Global Rate Limiting ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                   // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                    // Stricter for auth endpoints
  message: { error: 'Too many auth attempts — please try again later.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Data Sanitization against XSS
app.use(xss());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoverScart API', timestamp: new Date().toISOString() });
});




// Mount Modular Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const cmsRoutes = require('./routes/cms');
const reviewRoutes = require('./routes/reviews');
const couponRoutes = require('./routes/coupons');
const enterpriseRoutes = require('./routes/enterprise');
const mediaRoutes = require('./routes/media');
const eventRoutes = require('./routes/events');
const collectionRoutes = require('./routes/collections');
const mysteryRoutes = require('./routes/mystery');
const dropsRoutes = require('./routes/drops');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/mystery', mysteryRoutes);
app.use('/api/drops', dropsRoutes);
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/payments', require('./routes/payments'));

const { routeNotFound, errorHandler } = require('./middlewares/errorMiddleware');

// Mount Sentry Error Handler (must be before other error handlers)
if (Sentry.Handlers) {
  app.use(Sentry.Handlers.errorHandler());
}

// Mount Error Handling Middlewares
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CoversCartOnline Backend server running on port ${PORT}`);
});
