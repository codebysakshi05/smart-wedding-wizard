/**
 * routes/export.routes.js
 * Publicly accessible export and sharing routes.
 */

const { Router } = require("express");
const exportController = require("../controllers/export.controller");

const router = Router();

/**
 * GET /api/export-plan/:id
 * Generate and download a PDF version of a wedding plan.
 */
router.get("/export-plan/:id", exportController.exportPlanToPDF);

/**
 * GET /api/share-plan/:id
 * Public JSON endpoint to view basic details of a shared plan.
 */
router.get("/share-plan/:id", exportController.sharePlan);

module.exports = router;
