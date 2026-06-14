/**
 * routes/dashboard.routes.js
 * API endpoints for the user dashboard.
 */

const { Router } = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateSavePlanRequest } = require("../utils/validators");
const dashboardController = require("../controllers/dashboard.controller");

const router = Router();

/**
 * POST /api/save-plan
 * Save a generated wedding plan to the user's dashboard.
 */
router.post("/save-plan", requireAuth, validateSavePlanRequest, dashboardController.savePlan);

/**
 * GET /api/my-plans
 * Retrieve all saved plans for the authenticated user.
 */
router.get("/my-plans", requireAuth, dashboardController.getMyPlans);

/**
 * GET /api/plan/:id
 * Get details of a specific saved plan.
 */
router.get("/plan/:id", requireAuth, dashboardController.getPlanById);

/**
 * DELETE /api/plan/:id
 * Remove a plan from the user's dashboard.
 */
router.delete("/plan/:id", requireAuth, dashboardController.deletePlan);

module.exports = router;
