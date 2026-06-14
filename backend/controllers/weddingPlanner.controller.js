/**
 * controllers/weddingPlanner.controller.js
 * Handles the full Indian wedding planning endpoint.
 */

const { generateWeddingPlan } = require("../services/weddingPlanner.service");

/**
 * POST /api/wedding-plan
 * Body: { budget, religion, guests, state, theme, weddingDate }
 */
const createWeddingPlan = (req, res) => {
  try {
    const { budget, religion, guests, state, theme, weddingDate } = req.body;

    // Validate required fields
    if (!budget || !religion || !guests) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: budget, religion, guests",
      });
    }

    const validReligions = ["hindu", "muslim", "christian", "sikh", "south-indian", "south_indian"];
    if (!validReligions.includes(String(religion).toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid religion. Supported: ${validReligions.join(", ")}`,
      });
    }

    if (Number(budget) < 150000) {
      return res.status(400).json({
        success: false,
        message: "Minimum budget is ₹1,50,000 (1.5 lakh)",
      });
    }

    const plan = generateWeddingPlan({ budget, religion, guests, state, theme, weddingDate });

    return res.status(200).json({
      success: true,
      message: "Wedding plan generated successfully",
      data: plan,
    });
  } catch (err) {
    console.error("[WeddingPlannerController] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate wedding plan",
    });
  }
};

/**
 * GET /api/wedding-plan/sample
 * Returns a demo Hindu wedding plan.
 */
const getSamplePlan = (req, res) => {
  try {
    const plan = generateWeddingPlan({
      budget: 1000000,
      religion: "hindu",
      guests: 500,
      state: "Rajasthan",
      theme: "royal",
      weddingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Sample wedding plan retrieved",
      source: "static",
      data: plan,
    });
  } catch (err) {
    console.error("[WeddingPlannerController] Sample Error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to generate sample plan" });
  }
};

module.exports = { createWeddingPlan, getSamplePlan };
