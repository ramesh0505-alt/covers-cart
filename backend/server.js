const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');
require('dotenv').config();

if (!process.env.CLOUDINARY_URL) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    process.env.CLOUDINARY_URL = `cloudinary://${apiKey}:${apiSecret}@${cloudName}`;
  }
}

const { connectDatabase } = require('./models/db');

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', { reason, promise });
});

const validateEnv = () => {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'JWT_SECRET',
    'DATABASE_URL',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'CLOUDINARY_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
  if (missingEnvVars.length > 0) {
    console.error('❌ CRITICAL ERROR: Missing required environment variables:');
    missingEnvVars.forEach(key => console.error(`   - ${key}`));
    throw new Error('Missing required environment variables.');
  }

  const recommendedEnvVars = ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_JWT_SECRET', 'FRONTEND_URL', 'ADMIN_URL'];
  const missingRecommended = recommendedEnvVars.filter(key => !process.env[key]);
  if (missingRecommended.length > 0) {
    console.warn('⚠️ Recommended environment variables are missing:');
    missingRecommended.forEach(key => console.warn(`   - ${key}`));
  }
};

const app = express();
app.set('trust proxy', true);

Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND || 'https://placeholder@o0.ingest.sentry.io/0',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

if (Sentry.Handlers) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

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
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts — please try again later.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(xss());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', platform: 'cloudflare', uptime: true });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', platform: 'cloudflare', uptime: true });
});

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

if (Sentry.Handlers) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(routeNotFound);
app.use(errorHandler);

module.exports = app;
