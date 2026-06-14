/**
 * services/planner.service.js
 *
 * Unified Wedding Planner Service — Production Edition.
 * Uses weddingPlannerEngine.js for all plan generation.
 * Full religion-specific, state-personalized, budget-accurate responses.
 */

"use strict";

const { generatePlan } = require("../utils/weddingPlannerEngine");
const redisClient = require("../utils/redisClient");
const WeddingPlan = require("../models/WeddingPlan");
const mongoose = require("mongoose");

// ─── Main planner ─────────────────────────────────────────────────────────────
const createWeddingPlan = async ({
  userId,
  budget,
  guests,
  theme,
  location,
  religion,
  priorities,
  season,
  venueType,
}) => {
  const rel = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  const thm = String(theme || "royal").toLowerCase();
  const loc = String(location || "rajasthan");
  const prioArr = Array.isArray(priorities) ? priorities : [priorities || "luxury_decor"];
  const prioKey = [...prioArr].sort().join("-");
  const cacheKey = `plan_v9:${budget}:${guests}:${thm}:${loc}:${rel}:${prioKey}`
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  // ── 1. Redis cache check ──────────────────────────────────────────────────
  if (redisClient) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`[PlannerService] ✅ Cache HIT: ${cacheKey}`);
        return { plan: JSON.parse(cached), meta: { source: "cache", durationMs: 0 } };
      }
    } catch (err) {
      console.warn("[Redis] Cache read failed:", err.message);
    }
  }

  const startMs = Date.now();
  console.log(
    `[PlannerService] 🌸 Generating plan — ${rel} | ${thm} | ${loc} | ₹${budget} | ${guests} guests`,
  );

  // ── 2. Run the production engine ──────────────────────────────────────────
  const engineResult = generatePlan({
    budget: Number(budget) || 1000000,
    religion: rel,
    guests: Number(guests) || 200,
    location: loc,
    theme: thm,
    priorities: prioArr,
    season: season || "winter",
    venueType: venueType || null,
  });

  // ── 3. Assemble the unified response ─────────────────────────────────────
  const unifiedPlan = {
    // Core identifiers
    religion: rel,
    theme: thm,
    priorities: prioArr,
    _version: "v9-engine-2026",

    // Venues (full data with images)
    venues: engineResult.venues,
    primaryVenue: engineResult.primaryVenue,

    // Events and timeline
    events: engineResult.events,
    ceremonies: engineResult.ceremonies,
    rituals: engineResult.rituals,
    timeline: engineResult.timeline,

    // Visual assets
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

    // Planning tools
    budgetBreakdown: {
      ...engineResult.budgetBreakdown,
      // Legacy shape for existing frontend components
      total: engineResult.budgetBreakdown.total,
      tier: engineResult.budgetBreakdown.tier,
      categories: engineResult.budgetBreakdown.categories,
    },
    planningVault: engineResult.planningVault,
    checklist: engineResult.checklist,

    // Summary
    summary: {
      ...engineResult.weddingPlan,
      totalBudget: engineResult.budgetBreakdown.total,
      guests: Number(guests) || 200,
      theme: thm,
      religion: rel,
      location: loc,
      priorities: prioArr,
      perGuestCost: engineResult.budgetBreakdown.perGuestCost,
    },
  };

  // ── 4. Async DB save ──────────────────────────────────────────────────────
  if (mongoose.connection.readyState === 1 && userId && userId !== "guest") {
    WeddingPlan.create({
      userId,
      budget: Number(budget),
      guests: Number(guests),
      theme: thm,
      location: loc,
      options: [{ religion: rel, ...engineResult.weddingPlan }],
    }).catch((e) => console.warn("[MongoDB] Save failed:", e.message));
  }

  // ── 5. Cache for 15 min ───────────────────────────────────────────────────
  if (redisClient) {
    redisClient
      .setex(cacheKey, 900, JSON.stringify(unifiedPlan))
      .catch((e) => console.warn("[Redis] Cache write failed:", e.message));
  }

  const durationMs = Date.now() - startMs;
  console.log(
    `[PlannerService] ✅ Plan built in ${durationMs}ms — ${engineResult.venues.length} venues, ${engineResult.ceremonies.length} ceremonies`,
  );

  return { plan: unifiedPlan, meta: { source: "weddingPlannerEngine_v9", durationMs } };
};

module.exports = { createWeddingPlan };
