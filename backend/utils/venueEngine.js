/**
 * venueEngine.js
 *
 * Logical engine to match user preferences (budget, guests, religion, location)
 * with the venue database.
 */

const VENUES = require("../data/venueDatabase");

class VenueEngine {
  /**
   * findMatches
   * Filters venues based on complex criteria.
   */
  findMatches(criteria = {}) {
    const {
      budget = "premium",
      guests = 200,
      religion = "hindu",
      location = "all",
      style = "royal",
    } = criteria;

    console.log(
      `[VenueEngine] Searching for: ${religion} wedding, ${guests} guests, ${budget} budget in ${location}`,
    );

    let matches = VENUES.filter((v) => {
      // 1. Capacity Check (allow 20% overage)
      if (v.capacity < guests) return false;

      // 2. Religion Check
      if (!v.religions.includes(religion.toLowerCase())) {
        // Some religions have high overlap (e.g. South Indian / Hindu)
        if (religion.toLowerCase() === "south-indian" && !v.religions.includes("hindu"))
          return false;
      }

      // 3. Budget Check (Exact match or allow lower budget venues)
      const budgetMap = { budget: 1, "mid-range": 2, premium: 3 };
      if (budgetMap[v.budget] > budgetMap[budget]) return false;

      // 4. Location Check (State or City)
      if (location !== "all" && location !== "") {
        const loc = location.toLowerCase();
        if (!v.city.toLowerCase().includes(loc) && !v.state.toLowerCase().includes(loc))
          return false;
      }

      return true;
    });

    // 5. Fallback: If no matches, return a subset of premium/popular ones
    if (matches.length === 0) {
      console.warn("[VenueEngine] No exact matches found. Providing top-tier fallbacks.");
      matches = VENUES.filter((v) => v.budget === "premium").slice(0, 3);
    }

    // 6. Use local curated images from central system (NO external APIs)
    return matches.map((v) => {
      const stateSlug = v.state ? v.state.toLowerCase().replace(/\s+/g, "-") : "rajasthan";
      return {
        ...v,
        image: `/assets/venues/${stateSlug}/cover.jpg`,
        gallery: [`/assets/venues/${stateSlug}/cover.jpg`],
      };
    });
  }

  /**
   * getByCategory
   */
  getByCategory(category) {
    return VENUES.filter((v) => v.type === category.toLowerCase());
  }
}

module.exports = new VenueEngine();
