/**
 * utils/planParser.js
 *
 * Safely parses the raw string returned by the AI service into the
 * canonical WeddingPlan object.
 *
 * If parsing fails (malformed JSON, missing fields) a graceful fallback
 * object is returned so the API never crashes.
 */

/**
 * Expected top-level keys in the AI response.
 * Used both for validation and for building the fallback.
 */
const REQUIRED_KEYS = ["theme", "venue", "decor", "catering", "budgetBreakdown", "suggestions"];

/**
 * Parses a raw AI JSON string into a structured WeddingPlan.
 *
 * @param {string} rawJson   - Raw text from the AI (should be valid JSON)
 * @param {object} fallbackCtx - Context to personalise the fallback if needed
 * @param {string} fallbackCtx.theme
 * @param {string} fallbackCtx.location
 * @returns {object} Parsed or fallback WeddingPlan
 */
const parsePlan = (rawJson, { theme = "Elegant", location = "your chosen venue" } = {}) => {
  try {
    const parsed = JSON.parse(rawJson);

    if (!parsed.options || !Array.isArray(parsed.options)) {
      throw new Error("AI response missing 'options' array");
    }

    parsed.options.forEach((option, index) => {
      // Ensure all required top-level keys are present
      const missing = REQUIRED_KEYS.filter((k) => !(k in option));
      if (missing.length > 0) {
        console.warn(`[PlanParser] Missing keys in AI response for option ${index}:`, missing);
      }

      // Guarantee budgetBreakdown is an object
      if (!option.budgetBreakdown || typeof option.budgetBreakdown !== "object") {
        option.budgetBreakdown = {};
      }

      // Guarantee suggestions is an array
      if (!Array.isArray(option.suggestions)) {
        option.suggestions = option.suggestions ? [option.suggestions] : [];
      }
    });

    return parsed;
  } catch (err) {
    console.error("[PlanParser] Failed to parse AI response:", err.message);
    return buildFallbackPlan(theme, location);
  }
};

/* ─── Fallback ───────────────────────────────────────────────── */

/**
 * Returns a hardcoded-but-personalised plan matching the exact schema (3 options).
 * Used when OpenAI is unavailable or returns malformed output.
 */
const buildFallbackPlan = (theme, location) => {
  const createMockOption = (version) => ({
    version,
    theme: `${theme} Wedding (${version})`,
    venue: {
      name: `A charming ${theme.toLowerCase()} estate in ${location}`,
      description:
        `Nestled in the heart of ${location}, this venue blends natural beauty with timeless ` +
        `${theme.toLowerCase()} elegance. It features lush gardens, a grand ballroom, and ` +
        `panoramic views perfect for a once-in-a-lifetime celebration.`,
      capacity: "Up to 300 guests",
      highlights: ["Private garden for outdoor ceremony", "Bridal suite on-site", "Ample parking"],
    },
    decor: {
      palette: "Soft ivory, blush rose, and sage green",
      style: `${theme} with modern romantic accents`,
      elements: [
        "Cascading floral arches in whites and blushes",
        "Draped fairy-light canopies over the reception hall",
        "Personalised vow booklets tied with satin ribbon",
        "Centrepieces of peonies, garden roses, and eucalyptus",
        "Candlelit pathways leading to the ceremony",
      ],
      florals: "Seasonal blooms — garden roses, peonies, and baby's breath",
    },
    catering: {
      style: "Plated four-course dinner",
      menu: [
        "Delicate amuse-bouche to start",
        "Fresh garden salad with house vinaigrette",
        "Choice of beef tenderloin or pan-seared salmon",
      ],
      beverages: "Signature cocktails and premium wines",
      cake: "Bespoke three-tier wedding cake with floral accents",
    },
    budgetBreakdown: {}, // merged from pre-calculated allocation by the service
    suggestions: [
      "Book your venue and photographer at least 12 months in advance.",
      "Keep a 10–15 % contingency buffer within your total budget.",
      "Prioritise food and music — guests remember these most.",
      "Hire a day-of coordinator so you can be fully present.",
      "Add 2–3 deeply personal touches rather than many generic ones.",
    ],
  });

  return {
    options: [
      createMockOption("Budget Version"),
      createMockOption("Standard Version"),
      createMockOption("Premium Version"),
    ],
  };
};

module.exports = { parsePlan, buildFallbackPlan };
