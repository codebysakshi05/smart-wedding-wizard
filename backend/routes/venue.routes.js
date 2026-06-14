/**
 * routes/venue.routes.js
 */

const { Router } = require("express");
const venueController = require("../controllers/venue.controller");

const router = Router();

/**
 * GET /api/venues
 * Get venues based on location, budget, and capacity.
 */
router.get("/recommend", venueController.getVenues);

/**venues
 * GET /api/venues/recommend
 * Smart venue recommendation based on state, budget, and guests.
 */
router.get("/recommend", venueController.recommendVenues);

module.exports = router;
