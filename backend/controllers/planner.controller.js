/**
 * controllers/planner.controller.js
 * Handles HTTP request/response logic for the wedding planner endpoint.
 * Uses weddingPlannerEngine for all plan generation — no external AI dependencies.
 */

"use strict";

const plannerService = require("../services/planner.service");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const { validationResult } = require("../utils/validators");

// ─── POST /api/generate-plan ─────────────────────────────────────────────────
const generatePlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(
      "[PlannerController] Validation Errors:",
      JSON.stringify(errors.array(), null, 2),
    );
    return res.status(400).json(formatErrorResponse("Validation failed", errors.array()));
  }

  const { budget, guests, theme, location, religion, priority, priorities, season, venueType } =
    req.body;

  // Support both priorities[] (new) and priority string (legacy)
  const resolvedPriorities =
    Array.isArray(priorities) && priorities.length > 0
      ? priorities
      : priority
        ? [priority]
        : ["luxury_decor"];

  try {
    const { plan, meta } = await plannerService.createWeddingPlan({
      userId: req.user ? req.user.id : "guest",
      budget: Number(budget),
      guests: Number(guests),
      theme: theme || "royal",
      location: location || "rajasthan",
      religion: religion || "hindu",
      priorities: resolvedPriorities,
      season: season || "winter",
      venueType: venueType || null,
    });

    return res
      .status(200)
      .json(formatSuccessResponse("Wedding plan generated successfully", plan, meta));
  } catch (error) {
    console.error("[PlannerController] Error:", error.message, error.stack);
    return res
      .status(error.statusCode || 500)
      .json(formatErrorResponse(error.message || "An unexpected error occurred"));
  }
};

// ─── GET /api/sample-plan ────────────────────────────────────────────────────
/**
 * Serves a full, image-rich Hindu Royal demo plan using the weddingPlannerEngine.
 * This is the primary data source for demo/fallback mode in the frontend.
 */
const getSamplePlan = async (req, res) => {
  try {
    const { generatePlan: engineGenerate } = require("../utils/weddingPlannerEngine");

    const engineResult = engineGenerate({
      budget: 5000000,
      religion: "hindu",
      guests: 250,
      location: "rajasthan",
      theme: "royal",
      priorities: ["luxury_decor", "traditional_rituals", "photography"],
      season: "winter",
    });

    const unifiedPlan = {
      religion: "hindu",
      theme: "royal",
      priorities: ["luxury_decor", "traditional_rituals", "photography"],
      _cacheVersion: "v9-engine-2026",

      // Venues
      venues: engineResult.venues,
      primaryVenue: engineResult.primaryVenue,

      // Events & ceremonies
      events: engineResult.events,
      ceremonies: engineResult.ceremonies,
      rituals: engineResult.rituals,
      timeline: engineResult.timeline,

      // Images (all categories)
      images: {
        venueImages: engineResult.galleries.venues,
        decorImages: engineResult.galleries.decor,
        ceremonyImages: engineResult.galleries.decor,
        outfitImages: [...engineResult.galleries.bridal, ...engineResult.galleries.groom],
        mandapImages: engineResult.galleries.mandap,
        photographyImages: engineResult.galleries.photography,
        coupleImages: engineResult.galleries.couple,
        foodImages: engineResult.galleries.food,
        entertainmentImages: engineResult.galleries.entertainment,
      },
      galleries: engineResult.galleries,

      // Styling
      mandap: engineResult.mandap,
      outfits: engineResult.outfits,
      decor: engineResult.decor,

      // Services
      food: engineResult.food,
      photography: engineResult.photography,
      entertainment: engineResult.entertainment,

      // Planning
      budgetBreakdown: {
        ...engineResult.budgetBreakdown,
        total: engineResult.budgetBreakdown.total,
        tier: engineResult.budgetBreakdown.tier,
        categories: engineResult.budgetBreakdown.categories,
      },
      planningVault: engineResult.planningVault,
      checklist: engineResult.checklist,

      // Summary
      summary: {
        ...engineResult.weddingPlan,
        totalBudget: 5000000,
        guests: 250,
        theme: "royal",
        religion: "hindu",
        location: "rajasthan",
        priorities: ["luxury_decor", "traditional_rituals", "photography"],
        perGuestCost: engineResult.budgetBreakdown.perGuestCost,
      },
    };

    console.log(
      `[SamplePlan] ✅ Hindu Royal — ${engineResult.venues.length} venues, ${engineResult.ceremonies.length} ceremonies, ${Object.keys(engineResult.galleries).length} gallery categories`,
    );

    return res.status(200).json({
      success: true,
      isDemo: true,
      message: "Demo wedding plan loaded successfully",
      data: unifiedPlan,
      meta: { source: "weddingPlannerEngine_v9_demo", durationMs: 0 },
    });
  } catch (err) {
    console.error("[SamplePlan] Error:", err.message, err.stack);
    return res.status(500).json(formatErrorResponse("Failed to load sample plan"));
  }
};

module.exports = { generatePlan, getSamplePlan };
