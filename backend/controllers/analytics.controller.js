/**
 * controllers/analytics.controller.js
 *
 * HTTP layer for analytics endpoints.
 */

const analyticsService = require("../services/analytics.service");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");

/**
 * GET /api/analytics
 * Returns overall platform statistics.
 */
const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getPlatformAnalytics();
    return res.status(200).json(formatSuccessResponse("Analytics retrieved successfully", data));
  } catch (error) {
    console.error("[AnalyticsController] Error:", error.message);
    return res
      .status(500)
      .json(formatErrorResponse("An error occurred while retrieving analytics."));
  }
};

module.exports = {
  getAnalytics,
};
