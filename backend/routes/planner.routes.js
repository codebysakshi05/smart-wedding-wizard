/**
 * routes/planner.routes.js
 * Defines all wedding planner API endpoints and attaches validation middleware.
 */

const { Router } = require("express");
const { validatePlanRequest } = require("../utils/validators");
const { requireAuth } = require("../middleware/auth.middleware");
const plannerController = require("../controllers/planner.controller");

const router = Router();

/**
 * POST /api/generate-plan
 * Generate a full AI-powered wedding plan from user preferences.
 *
 * Body: { budget, guests, theme, location, priority }
 */
router.post(
  "/generate-plan",
  requireAuth,
  validatePlanRequest, // input validation middleware
  plannerController.generatePlan,
);

/**
 * GET /api/sample-plan
 * Get a demo-safe mock wedding plan.
 */
router.get("/sample-plan", plannerController.getSamplePlan);

module.exports = router;
