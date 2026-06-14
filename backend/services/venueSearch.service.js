/**
 * services/venueSearch.service.js
 *
 * Google Places API integration for live wedding venue search.
 * Falls back to curated static dataset when:
 *  - GOOGLE_PLACES_API_KEY is not set
 *  - API quota is exceeded / network error
 *
 * Priority-aware: filters & boosts venues matching user priorities.
 */

const axios = require("axios");
const venueEngine = require("../utils/venueEngine");

const PLACES_BASE = "https://maps.googleapis.com/maps/api/place";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PHOTO_BASE = "https://maps.googleapis.com/maps/api/place/photo";

// â”€â”€ In-memory cache â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}
function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// â”€â”€ Budget tier mapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function mapPriceLevel(priceLevel) {
  if (priceLevel === undefined || priceLevel === null) return "mid";
  if (priceLevel <= 1) return "budget";
  if (priceLevel === 2) return "mid";
  return "premium";
}

function buildPhotoUrl(photoRef) {
  if (!photoRef) return null;
  return `${PHOTO_BASE}?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
}

function normalizePlace(place, state) {
  const photoRef = place.photos?.[0]?.photo_reference;
  const address = place.vicinity || place.formatted_address || "";

  // Attempt to extract city from address (naively)
  const parts = address.split(",");
  const city = parts.length > 1 ? parts[parts.length - 2].trim() : parts[0] || state;

  return {
    name: place.name,
    state,
    city,
    location: address,
    address: address,
    rating: place.rating || 4.0,
    userRatingsTotal: place.user_ratings_total || 0,
    budgetTier: mapPriceLevel(place.price_level),
    priceCategory: mapPriceLevel(place.price_level), // backwards compatibility
    priceLevel: place.price_level,
    guests: estimateCapacity(place.price_level),
    capacity: estimateCapacity(place.price_level), // backwards compatibility
    venueType: classifyType(place.types || []),
    type: classifyType(place.types || []), // backwards compatibility
    estimatedPrice: estimatePriceRange(place.price_level),
    tags: buildTagsFromType(place.types || []),
    image: buildPhotoUrl(photoRef) || getFallbackImage(state),
    googlePlaceId: place.place_id,
    isLive: true,
  };
}

function estimateCapacity(priceLevel) {
  if (!priceLevel) return 300;
  if (priceLevel <= 1) return 200;
  if (priceLevel === 2) return 500;
  return 1000;
}

function estimatePriceRange(priceLevel) {
  if (!priceLevel) return "â‚¹5L â€“ â‚¹15L";
  if (priceLevel <= 1) return "â‚¹1L â€“ â‚¹4L";
  if (priceLevel === 2) return "â‚¹4L â€“ â‚¹12L";
  return "â‚¹12L â€“ â‚¹50L";
}

function classifyType(types) {
  const t = types.join(" ");
  if (t.includes("palace") || t.includes("castle")) return "palace";
  if (t.includes("beach") || t.includes("ocean")) return "beach";
  if (t.includes("resort") || t.includes("lodging")) return "resort";
  if (t.includes("temple")) return "temple";
  if (t.includes("church")) return "church";
  if (t.includes("park") || t.includes("garden")) return "garden";
  if (t.includes("farm")) return "farmhouse";
  return "banquet";
}

function buildTagsFromType(types) {
  const tags = [];
  if (types.some((t) => ["lodging", "resort"].includes(t))) tags.push("outdoor", "outdoor_wedding");
  if (types.some((t) => t.includes("park") || t.includes("garden")))
    tags.push("outdoor", "outdoor_wedding");
  return tags;
}

function getFallbackImage(state) {
  // Use local curated venue images based on state/location
  const map = {
    Rajasthan: "/assets/assets/venues/rajasthan/cover.jpg",
    Goa: "/assets/assets/venues/goa/cover.jpg",
    Delhi: "/assets/assets/venues/delhi/cover.jpg",
    Karnataka: "/assets/assets/venues/karnataka/cover.jpg",
    Kerala: "/assets/assets/venues/kerala/cover.jpg",
    Telangana: "/assets/assets/venues/telangana/cover.jpg",
    "Himachal Pradesh": "/assets/assets/venues/punjab/cover.jpg",
  };
  return map[state] || "/assets/assets/venues/rajasthan/cover.jpg";
}

// â”€â”€ Priority-aware scoring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Scores a venue against user priorities.
 * Returns a relevance score: 0â€“10.
 */
function scoreVenueByPriorities(venue, priorities, religion, theme) {
  let score = venue.rating || 4.0;
  const tags = venue.tags || [];
  const vType = venue.venueType || venue.type || "";
  const rel = String(religion || "").toLowerCase();
  const thm = String(theme || "").toLowerCase();

  // 1. Priority Match (User explicit choices)
  if (priorities && priorities.length) {
    for (const p of priorities) {
      if (tags.includes(p)) score += 1.5;
    }
  }

  // 2. Religion Match
  if (rel) {
    if (tags.includes(`religion_${rel}`)) score += 3.0; // Strong boost for religious match
    if (rel === "christian" && vType === "church") score += 5.0;
    if (rel === "hindu" && vType === "temple") score += 5.0;
    if (rel === "sikh" && vType === "temple") score += 5.0;
  }

  // 3. Theme Match
  if (thm) {
    if (thm === "royal" && vType === "palace") score += 4.0;
    if (thm === "minimalist" && (vType === "resort" || vType === "farmhouse")) score += 2.0;
    if (tags.includes(thm)) score += 2.0;
  }

  return score;
}

// â”€â”€ GOOGLE PLACES TEXT SEARCH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function searchGooglePlaces(state, budgetTier, guests, city = "") {
  const locationQuery = city ? `${city}, ${state}` : state;
  const cacheKey = `gplaces:${locationQuery}:${budgetTier}:${guests}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[VenueSearch] Cache hit for "${locationQuery}"`);
    return cached;
  }

  const query = `best wedding venues in ${locationQuery} India`;
  console.log(`[VenueSearch] Google Places search: "${query}"`);

  try {
    const searchRes = await axios.get(`${PLACES_BASE}/textsearch/json`, {
      params: { query, type: "establishment", key: API_KEY },
      timeout: 8000,
    });

    if (searchRes.data.status !== "OK" && searchRes.data.status !== "ZERO_RESULTS") {
      throw new Error(`Places API error: ${searchRes.data.status}`);
    }

    const results = searchRes.data.results || [];
    let normalized = results
      .filter((p) => (p.rating || 0) >= 3.5)
      .map((p) => normalizePlace(p, state))
      .sort((a, b) => b.rating - a.rating);

    // Filter by guests and budget if strictly required
    if (budgetTier && normalized.length > 5) {
      const filtered = normalized.filter((v) => v.priceCategory === budgetTier);
      if (filtered.length >= 2) normalized = filtered;
    }

    const top8 = normalized.slice(0, 8);
    setCache(cacheKey, top8);
    return top8;
  } catch (error) {
    console.error(`[VenueSearch] Google Search failed: ${error.message}`);
    return [];
  }
}

// â”€â”€ STATIC FALLBACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getStaticVenues(state, budgetTier, guests, priorities, religion, theme) {
  console.log(`[VenueSearch] Using curated engine fallback for "${state}"`);

  const venues = venueEngine.findMatches({
    location: state || "all",
    budget: budgetTier || "premium",
    guests: Number(guests) || 200,
    religion: religion || "hindu",
    style: theme || "royal",
  });

  const priArr = Array.isArray(priorities) ? priorities : priorities ? [priorities] : [];

  return venues
    .map((v) => ({
      ...v,
      _score: scoreVenueByPriorities(v, priArr, religion, theme),
      isLive: false,
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 8);
}

// â”€â”€ MAIN EXPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Get venues â€” tries Google Places live, falls back to static.
 * @param {string} state
 * @param {string} budgetTier
 * @param {number} guests
 * @param {string[]} priorities
 */
async function getVenuesWithFallback(state, budgetTier, guests, priorities, religion, theme) {
  const priArr = Array.isArray(priorities) ? priorities : [];

  if (API_KEY) {
    try {
      const liveVenues = await searchGooglePlaces(state, budgetTier, guests);
      if (liveVenues.length > 0) {
        // Apply priority scoring even to live results
        const scored = liveVenues
          .map((v) => ({ ...v, _score: scoreVenueByPriorities(v, priArr, religion, theme) }))
          .sort((a, b) => b._score - a._score);
        console.log(`[VenueSearch] âœ… Returning ${scored.length} priority-scored live venues`);
        return { venues: scored, source: "google_places" };
      }
    } catch (err) {
      console.warn(`[VenueSearch] Google Places failed: ${err.message} â€” using static fallback`);
    }
  } else {
    console.log("[VenueSearch] No API key â€” using static data");
  }

  const staticResult = getStaticVenues(state, budgetTier, guests, priorities, religion, theme);
  return { venues: staticResult, source: "static" };
}

module.exports = { getVenuesWithFallback };
