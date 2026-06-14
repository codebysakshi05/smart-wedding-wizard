/**
 * controllers/dashboard.controller.js
 * Handles user-specific dashboard actions: saving, retrieving, and deleting plans.
 */

const SavedPlan = require("../models/SavedPlan");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const { validationResult } = require("../utils/validators");
const mongoose = require("mongoose");

/**
 * Mock data for fallback when MongoDB is unavailable.
 */
const MOCK_SAVED_PLANS = [
  {
    _id: "mock-1",
    theme: "Royal Heritage",
    budget: 2500000,
    guests: 150,
    images: ["/assets/assets/decor/royal/royal1.jpg"],
    plan: {
      version: "Premium Version",
      venue: { name: "City Palace", description: "Historic royal venue" },
      decor: { palette: "Gold & Crimson", style: "Traditional Royal" },
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mock-2",
    theme: "Modern Minimalism",
    budget: 800000,
    guests: 50,
    images: ["/assets/assets/decor/minimal/minimal1.jpg"],
    plan: {
      version: "Budget Version",
      venue: { name: "Garden Boutique", description: "Intimate outdoor space" },
      decor: { palette: "White & Green", style: "Modern Minimalist" },
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * POST /api/save-plan
 */
const savePlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrorResponse("Validation failed", errors.array()));
  }

  const { plan, budget, theme, guests, images } = req.body;
  const userId = req.user.id;

  try {
    const newSavedPlan = new SavedPlan({
      userId,
      plan,
      budget,
      theme,
      guests,
      images,
    });

    const saved = await newSavedPlan.save();
    return res.status(201).json(formatSuccessResponse("Plan saved to dashboard", saved));
  } catch (error) {
    console.error("[DashboardController] Save error:", error.message);
    return res.status(500).json(formatErrorResponse("Failed to save plan. Please try again."));
  }
};

/**
 * GET /api/my-plans
 */
const getMyPlans = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("[DashboardController] MongoDB not connected, returning mock data.");
      return res.status(200).json(
        formatSuccessResponse("Retrieved plans (Demo Mode)", MOCK_SAVED_PLANS, {
          source: "fallback",
        }),
      );
    }

    const plans = await SavedPlan.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(formatSuccessResponse("My saved plans retrieved", plans));
  } catch (error) {
    console.error("[DashboardController] Get plans error:", error.message);
    // Graceful fallback on error
    return res.status(200).json(
      formatSuccessResponse("Retrieved plans (Demo Mode)", MOCK_SAVED_PLANS, {
        source: "fallback",
      }),
    );
  }
};

/**
 * GET /api/plan/:id
 */
const getPlanById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Handle mock IDs
  if (id.startsWith("mock-")) {
    const mock = MOCK_SAVED_PLANS.find((p) => p._id === id);
    if (mock) return res.status(200).json(formatSuccessResponse("Plan details retrieved", mock));
    return res.status(404).json(formatErrorResponse("Plan not found"));
  }

  try {
    const plan = await SavedPlan.findOne({ _id: id, userId });
    if (!plan) {
      return res.status(404).json(formatErrorResponse("Plan not found or unauthorized"));
    }
    return res.status(200).json(formatSuccessResponse("Plan details retrieved", plan));
  } catch (error) {
    console.error("[DashboardController] Get plan detail error:", error.message);
    return res.status(500).json(formatErrorResponse("Error retrieving plan details"));
  }
};

/**
 * DELETE /api/plan/:id
 */
const deletePlan = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await SavedPlan.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json(formatErrorResponse("Plan not found or unauthorized"));
    }
    return res.status(200).json(formatSuccessResponse("Plan deleted successfully"));
  } catch (error) {
    console.error("[DashboardController] Delete error:", error.message);
    return res.status(500).json(formatErrorResponse("Failed to delete plan"));
  }
};

module.exports = {
  savePlan,
  getMyPlans,
  getPlanById,
  deletePlan,
};
