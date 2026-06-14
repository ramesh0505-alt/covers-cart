const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Extracts user from request token.
 *
 * Supports two token formats:
 *   1. Mock JWT (dev):       "mock-jwt-token-<userId>"
 *   2. Real Supabase JWT:    standard JWT verified with SUPABASE_JWT_SECRET
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // ── 1. Mock JWT (development / demo mode) ─────────────────────────────
    if (token.startsWith('mock-jwt-token-')) {
      const userId = token.replace('mock-jwt-token-', '');
      if (!userId) return res.status(401).json({ error: 'Invalid mock token.' });
      req.user = {
        id: userId,
        sub: userId,
        role: userId === 'admin-id-123' ? 'ADMIN' : 'CUSTOMER',
      };
      return next();
    }

    // ── 2. Real Supabase JWT ───────────────────────────────────────────────
    const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (supabaseJwtSecret) {
      const decoded = jwt.verify(token, supabaseJwtSecret);
      req.user = {
        id: decoded.sub,
        sub: decoded.sub,
        email: decoded.email,
        role: (decoded.user_metadata?.role || decoded.role || 'CUSTOMER').toUpperCase(),
      };
      return next();
    }

    // ── 3. Fallback: own JWT_SECRET ────────────────────────────────────────
    const jwtSecret = process.env.JWT_SECRET || 'coverscartonline_super_secret_key';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const ADMIN_PORTAL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'DESIGNER'];

const isAdmin = (req, res, next) => {
  const role = (req.user?.role || '').toUpperCase();
  if (ADMIN_PORTAL_ROLES.includes(role)) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Admin-level role required.' });
};

/** Reject mock tokens outside development — admin portal must use real JWT in production */
const rejectMockTokenInProduction = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1] || '';
  if (
    process.env.NODE_ENV === 'production' &&
    token.startsWith('mock-jwt-token-')
  ) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
  return next();
};

const hasRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles.map(r => String(r).toUpperCase()) : [];
  return (req, res, next) => {
    const role = (req.user?.role || '').toUpperCase();
    if (allowed.includes(role)) {
      return next();
    }
    return res.status(403).json({ error: `Access denied. Requires one of: ${allowed.join(', ')}` });
  };
};

module.exports = {
  verifyToken,
  isAdmin,
  hasRole,
  rejectMockTokenInProduction,
  ADMIN_PORTAL_ROLES,
};

