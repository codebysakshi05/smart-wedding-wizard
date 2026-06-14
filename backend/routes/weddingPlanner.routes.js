/**
 * routes/weddingPlanner.routes.js
 * Routes for the full Indian wedding planning system.
 */

const { Router } = require("express");
const { createWeddingPlan, getSamplePlan } = require("../controllers/weddingPlanner.controller");

const router = Router();

/**
 * POST /api/wedding-plan
 * Generate a complete Indian wedding plan.
 * Body: { budget, religion, guests, state, theme, weddingDate }
 */
router.post("/wedding-plan", createWeddingPlan);

/**
 * GET /api/wedding-plan/sample
 * Get a demo Hindu wedding plan (no auth required).
 */
router.get("/wedding-plan/sample", getSamplePlan);

module.exports = router;
