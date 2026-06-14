/**
 * utils/budgetCalculator.js
 *
 * Splits a wedding budget across five core categories and adjusts weights
 * based on:
 *   1. Budget range  – low / medium / high tiers change the base split.
 *   2. User priorities – array of selected priorities, each boosting a category.
 *
 * Categories   : venue, catering, decoration, photography, misc
 */

/* ─── Tier Definitions ───────────────────────────────────────── */

const TIER_WEIGHTS = {
  low: {
    venue: 0.35,
    catering: 0.3,
    decoration: 0.15,
    photography: 0.12,
    misc: 0.08,
  },
  medium: {
    venue: 0.3,
    catering: 0.28,
    decoration: 0.17,
    photography: 0.15,
    misc: 0.1,
  },
  high: {
    venue: 0.28,
    catering: 0.25,
    decoration: 0.2,
    photography: 0.18,
    misc: 0.09,
  },
};

/** Boost per single priority selection */
const PRIORITY_BOOST = 0.08;

/** Budget thresholds in INR */
const TIER_THRESHOLDS = {
  LOW_MAX: 200_000,
  MEDIUM_MAX: 500_000,
};

/**
 * Maps priority keys → budget categories they boost.
 * Multiple priorities can boost the same category — boosts accumulate.
 */
const PRIORITY_CATEGORY_MAP = {
  luxury_decor: "decoration",
  budget_friendly: null, // reduces misc instead
  destination_wedding: "venue",
  photography: "photography",
  outdoor_wedding: "venue",
  celebrity_style: "decoration",
  traditional_rituals: "catering",
  modern_theme: "decoration",
  minimalist_wedding: null, // no boost — keeps budget tight
};

/* ─── Public API ─────────────────────────────────────────────── */

const getBudgetTier = (totalBudget) => {
  if (totalBudget < TIER_THRESHOLDS.LOW_MAX) return "low";
  if (totalBudget < TIER_THRESHOLDS.MEDIUM_MAX) return "medium";
  return "high";
};

/**
 * Allocates the total budget across the five wedding categories.
 * Accepts priorities as a string[] array OR a single string (backward-compatible).
 *
 * @param {number} totalBudget  Total wedding budget in INR.
 * @param {string|string[]} priorities  Category name(s) to boost.
 * @returns {{ tier, totalBudget, priorities, categories, summary }}
 */
const allocateBudget = (totalBudget, priorities) => {
  const tier = getBudgetTier(totalBudget);
  const weights = { ...TIER_WEIGHTS[tier] };

  // Normalise priorities to array
  let priorityArr = [];
  if (Array.isArray(priorities)) {
    priorityArr = priorities.map((p) => String(p).toLowerCase().trim());
  } else if (typeof priorities === "string" && priorities) {
    // Legacy single-string support: map old keys to new
    const legacy = {
      decoration: "luxury_decor",
      catering: "traditional_rituals",
      venue: "destination_wedding",
      photography: "photography",
    };
    const mapped = legacy[priorities.toLowerCase()] || priorities.toLowerCase();
    priorityArr = [mapped];
  }

  // Accumulate boosts
  const boostMap = {};
  for (const p of priorityArr) {
    const cat = PRIORITY_CATEGORY_MAP[p];
    if (cat && weights[cat] !== undefined) {
      boostMap[cat] = (boostMap[cat] || 0) + PRIORITY_BOOST;
    }
  }

  // Apply boosts (cap each category at 0.60 to stay sane)
  for (const [cat, boost] of Object.entries(boostMap)) {
    const totalBoost = Math.min(boost, 0.2); // max +20% total per category
    const otherKeys = Object.keys(weights).filter((k) => k !== cat);
    const totalOther = otherKeys.reduce((s, k) => s + weights[k], 0);
    otherKeys.forEach((k) => {
      const share = weights[k] / totalOther;
      weights[k] = Math.max(0.02, weights[k] - totalBoost * share);
    });
    weights[cat] = Math.min(0.6, weights[cat] + totalBoost);
  }

  // Normalise so weights sum to 1.0 exactly
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  for (const k of Object.keys(weights)) weights[k] = weights[k] / total;

  // Convert to rupee amounts
  const categories = {};
  let allocated = 0;
  const keys = Object.keys(weights);
  keys.forEach((key, idx) => {
    const isLast = idx === keys.length - 1;
    const amount = isLast ? totalBudget - allocated : Math.round(totalBudget * weights[key]);
    categories[key] = {
      amount,
      percentage: Math.round(weights[key] * 100 * 10) / 10,
      // Legacy aliases used by frontend
      value: amount,
    };
    allocated += amount;
  });

  const summary = Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, v.amount]));

  return {
    tier,
    totalBudget,
    priorities: priorityArr,
    categories,
    summary,
  };
};

/**
 * Calculates budget allocations for 3 variations: Budget, Standard, Premium.
 */
const allocateVariations = (baseBudget, priorities) => [
  { version: "Budget", allocation: allocateBudget(Math.round(baseBudget * 0.7), priorities) },
  { version: "Standard", allocation: allocateBudget(baseBudget, priorities) },
  { version: "Premium", allocation: allocateBudget(Math.round(baseBudget * 1.5), priorities) },
];

module.exports = {
  allocateBudget,
  allocateVariations,
  getBudgetTier,
  TIER_WEIGHTS,
  PRIORITY_BOOST,
  PRIORITY_CATEGORY_MAP,
};
