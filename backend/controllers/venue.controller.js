/**
 * controllers/venue.controller.js
 * Handles venue searching, smart recommendations, live Google Places search,
 * and decor suggestions.
 */

const venueEngine = require("../utils/venueEngine");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const { getVenuesWithFallback } = require("../services/venueSearch.service");
const { generateDecorSuggestions } = require("../services/decor.service");

// ── Budget mapping ─────────────────────────────────────────────────────────────
function mapBudgetToCategory(budget) {
  if (!budget) return "premium";
  const b = String(budget).toLowerCase();
  if (b.includes("low") || b.includes("budget")) return "budget";
  if (b.includes("medium") || b.includes("mid")) return "mid-range";
  if (b.includes("high") || b.includes("premium")) return "premium";
  return "premium";
}

// ── GET /api/venues ────────────────────────────────────────────────────────────
const getVenues = (req, res) => {
  console.log("[VenueController] GET /api/venues | query:", req.query);
  const { city, state, type, guests, budget, religion } = req.query;
  try {
    const category = mapBudgetToCategory(budget);
    const venues = venueEngine.findMatches({
      location: city || state || "all",
      budget: category,
      guests: Number(guests) || 200,
      religion: religion || "hindu",
    });

    return res
      .status(200)
      .json({ success: true, count: venues.length, source: "curated_engine", data: venues });
  } catch (err) {
    console.error("[VenueController] getVenues Error:", err.message);
    return res.status(500).json(formatErrorResponse("Failed to fetch venues"));
  }
};

// ── GET /api/venues/recommend ──────────────────────────────────────────────────
const recommendVenues = (req, res) => {
  console.log("[VenueController] GET /api/venues/recommend | query:", req.query);
  const { state, city, location, budget, budgetTier, guests, religion, style } = req.query;
  try {
    const category = mapBudgetToCategory(budgetTier || budget);
    const venues = venueEngine.findMatches({
      location: city || state || location || "all",
      budget: category,
      guests: Number(guests) || 200,
      religion: religion || "hindu",
      style: style || "royal",
    });

    console.log(`[VenueController] Returning ${venues.length} matched venues`);
    return res.status(200).json({
      success: true,
      count: venues.length,
      source: "curated_engine",
      filters: {
        location: location || state || "any",
        budgetCategory: category,
        guests: guests || 200,
        religion: religion || "hindu",
      },
      data: venues,
    });
  } catch (err) {
    console.error("[VenueController] recommendVenues Error:", err.message);
    return res.status(500).json(formatErrorResponse("Failed to recommend venues"));
  }
};

// ── GET /api/venues/live ───────────────────────────────────────────────────────
/**
 * Live venue search via Google Places API.
 * Falls back to curated static data when key is absent or API fails.
 * Query params: state, budgetTier (budget|mid|premium), guests
 */
const getLiveVenues = async (req, res) => {
  console.log("[VenueController] GET /api/venues/live | query:", req.query);
  const { state, budgetTier, budget, guests } = req.query;

  if (!state) {
    return res.status(400).json(formatErrorResponse("state query param is required"));
  }

  try {
    const category = mapBudgetToCategory(budgetTier || budget) || "mid";
    const { venues, source } = await getVenuesWithFallback(state, category, guests);

    console.log(`[VenueController] /live returning ${venues.length} venues from "${source}"`);

    return res.status(200).json({
      success: true,
      count: venues.length,
      source,
      isLive: source === "google_places",
      filters: { state, budgetCategory: category, guests: guests || "any" },
      data: venues,
    });
  } catch (err) {
    console.error("[VenueController] getLiveVenues Error:", err.message);
    return res.status(500).json(formatErrorResponse("Failed to search venues"));
  }
};

// ── POST /api/decor-suggestions ────────────────────────────────────────────────
/**
 * Generate decor ideas for a specific venue + theme + religion.
 * Optionally generates AI decor images via /api/generate-image.
 * Body: { venue, theme, religion, state, generateImages? }
 */
const getDecorSuggestions = async (req, res) => {
  console.log("[VenueController] POST /api/decor-suggestions | body:", req.body);
  const { venue, theme, religion, state, generateImages } = req.body;

  if (!theme && !venue) {
    return res.status(400).json(formatErrorResponse("venue or theme is required"));
  }

  try {
    const suggestions = generateDecorSuggestions({ venue, theme, religion, state });

    // Optionally trigger image generation using the built AI prompt
    let images = [];
    if (generateImages) {
      try {
        const { generateWeddingImages } = require("../services/image.service");
        const result = await generateWeddingImages({
          theme: `${religion} ${theme} wedding decor at ${venue || "palace"} in ${state || "India"}`,
          budget: 1000000,
          styles: ["cinematic", "detail"],
          venueType: "palace",
        });
        images = result.map((r) => r.imageUrl).filter(Boolean);
        console.log(`[VenueController] Generated ${images.length} decor images`);
      } catch (imgErr) {
        console.warn("[VenueController] Image generation failed (non-critical):", imgErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...suggestions,
        images,
      },
    });
  } catch (err) {
    console.error("[VenueController] getDecorSuggestions Error:", err.message);
    return res.status(500).json(formatErrorResponse("Failed to generate decor suggestions"));
  }
};

module.exports = { getVenues, recommendVenues, getLiveVenues, getDecorSuggestions };
