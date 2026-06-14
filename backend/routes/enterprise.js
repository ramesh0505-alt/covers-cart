const express = require('express');
const router = express.Router();
const controller = require('../controllers/enterpriseController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// ── Access Logging Middleware (applied to all enterprise routes) ──────────────
const accessLog = (req, res, next) => {
  const userId = req.user?.id || 'anonymous';
  const role   = req.user?.role || 'none';
  console.log(JSON.stringify({
    ts:     new Date().toISOString(),
    event:  'enterprise_access',
    method: req.method,
    path:   req.path,
    userId,
    role,
    ip:     req.ip,
  }));
  next();
};

// All enterprise routes require authentication
router.use(verifyToken, accessLog);

// 1. Abandoned Carts & Analytics
router.post('/abandoned-carts/track', controller.trackAbandonedCart);
router.get('/abandoned-carts/analytics', isAdmin, controller.getAbandonedCartAnalytics);
router.get('/analytics-dashboard', isAdmin, controller.getAnalyticsDashboard);

// 2. Returns
router.post('/returns', controller.requestReturn);
router.get('/returns', isAdmin, controller.listReturns);
router.patch('/returns/:id/status', isAdmin, controller.updateReturnStatus);

// 3. Exchanges
router.post('/exchanges', controller.requestExchange);

// 4. Store Credit
router.get('/store-credit/balance', controller.getStoreCreditBalance);
router.post('/store-credit/issue', isAdmin, controller.issueStoreCredit);

// 5. Gift Cards
router.post('/gift-cards/purchase', controller.purchaseGiftCard);
router.post('/gift-cards/redeem', controller.redeemGiftCard);

// 6. Waitlist
router.post('/waitlist/join', controller.joinWaitlist);

// 7. Preorders
router.post('/preorders/setup', isAdmin, controller.setupPreorder);

// 8. Vendors
router.post('/vendors', isAdmin, controller.createVendor);

// 9. Media Library
router.get('/media/search', isAdmin, controller.searchMedia);

// 10. SEO
router.post('/seo/redirects', isAdmin, controller.createRedirectRule);

// 11. Notifications
router.post('/notifications/send', isAdmin, controller.sendNotification);

// 12. Support
router.post('/support/escalate', controller.escalateTicket);

// 13. Automations
router.post('/automations/rules', isAdmin, controller.createAutomationRule);

// 14. Job Queue
router.post('/jobs/enqueue', isAdmin, controller.enqueueJob);

// 15. Feature Flags
router.post('/feature-flags/evaluation', controller.evaluateFeatureFlags);

// 16. Observability
router.post('/observability/client-errors', controller.logClientError);

// 17. Fraud
router.get('/fraud/risk-score/:userId', isAdmin, controller.getRiskScore);

// 18. Warehouse
router.get('/warehouse/pick-lists', isAdmin, controller.getPickLists);

// 19. Search Engine
router.get('/search', controller.searchCatalogAdvanced);

// 20. Devices
router.get('/devices', controller.getDevices);

// 21. Artworks
router.get('/artworks', controller.listCreatorArtworks);

// 22. Production Pipeline
router.post('/production/qc', isAdmin, controller.qcProductionItem);

module.exports = router;

