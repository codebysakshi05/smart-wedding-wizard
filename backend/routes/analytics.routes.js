/**
 * routes/analytics.routes.js
 *
 * Exposes analytics endpoints.
 */

const { Router } = require("express");
const analyticsController = require("../controllers/analytics.controller");
// Note: Can protect this with requireAuth if only admins should see it.
// For now, leaving it unprotected or protected as a general endpoint based on requirements.
// Let's protect it so only authenticated users can see stats.
const { requireAuth } = require("../middleware/auth.middleware");

const router = Router();

/**
 * GET /api/analytics
 * Retrieve platform-wide wedding plan statistics.
 */
router.get("/", requireAuth, analyticsController.getAnalytics);

module.exports = router;
