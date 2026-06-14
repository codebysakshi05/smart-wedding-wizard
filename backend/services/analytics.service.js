/**
 * services/analytics.service.js
 *
 * Provides analytics data for the wedding plans.
 */

const WeddingPlan = require("../models/WeddingPlan");

/**
 * Retrieves platform analytics:
 * - Total plans generated
 * - Most selected theme
 * - Average budget
 *
 * @returns {Promise<object>} Analytics data
 */
const getPlatformAnalytics = async () => {
  // We can run these aggregations in parallel
  const [totalPlans, themeStats, budgetStats] = await Promise.all([
    WeddingPlan.countDocuments(),

    // Aggregation to find the most selected theme
    WeddingPlan.aggregate([
      { $group: { _id: "$theme", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    // Aggregation to find the average budget
    WeddingPlan.aggregate([{ $group: { _id: null, avgBudget: { $avg: "$budget" } } }]),
  ]);

  const mostSelectedTheme = themeStats.length > 0 ? themeStats[0]._id : "N/A";
  const averageBudget = budgetStats.length > 0 ? Math.round(budgetStats[0].avgBudget) : 0;

  return {
    totalPlans,
    mostSelectedTheme,
    averageBudget,
  };
};

module.exports = {
  getPlatformAnalytics,
};
