/**
 * services/decor.service.js
 * Generates decor suggestions for a given venue + theme + religion.
 * Uses static curated data (no AI key required).
 */

const { decorThemes } = require("../data/weddingData");

const decorByTheme = {
  royal: {
    elements: [
      "Gold-draped mandap",
      "Crystal chandeliers",
      "Marigold cascades",
      "Royal red carpet",
      "Silver candelabras",
    ],
    colors: ["Deep Red", "Royal Gold", "Ivory", "Burgundy"],
    flowers: ["Marigold", "Red Rose", "Mogra", "Tuberose"],
    lighting: ["Crystal chandeliers", "Warm uplighting", "Diya clusters", "Fairy light ceiling"],
    signature: ["Carved archway entrance", "Floral curtain backdrop", "Peacock motif accents"],
    mood: "Opulent, majestic, timeless",
  },
  traditional: {
    elements: [
      "Banana leaf entrance",
      "Kolam/Rangoli floor art",
      "Clay pot decor",
      "Silk draping",
      "Brass urns",
    ],
    colors: ["Turmeric Yellow", "Kumkum Red", "Mango Green", "Saffron"],
    flowers: ["Marigold", "Jasmine", "Mogra", "Lotus", "Hibiscus"],
    lighting: ["Oil diyas", "Brass lamps", "Coconut shell candles", "Warm string lights"],
    signature: ["Toran gate entry", "Flower petal pathways", "Traditional Mandap"],
    mood: "Earthy, cultural, heartfelt",
  },
  minimalist: {
    elements: [
      "White linen draping",
      "Geometric structures",
      "Single bloom arrangements",
      "Candle clusters",
    ],
    colors: ["White", "Blush Pink", "Sage Green", "Champagne"],
    flowers: ["White Rose", "Baby's Breath", "Eucalyptus", "Pampas grass"],
    lighting: ["Edison bulb strings", "Candles", "Soft white LEDs"],
    signature: ["Clean arch with minimal greenery", "Acrylic signage", "Modern centrepieces"],
    mood: "Elegant, contemporary, serene",
  },
  beach: {
    elements: ["Driftwood arch", "Sea-shell decor", "Tiki torches", "Flowing fabric canopy"],
    colors: ["Turquoise", "Sandy Beige", "Coral", "White"],
    flowers: ["Tropical hibiscus", "Plumeria", "Bird of paradise", "Palm leaves"],
    lighting: ["Tiki torches", "Lanterns on poles", "Fairy light canopy"],
    signature: ["Barefoot aisle on sand", "Sea-glass centrepieces", "Coconut shell candles"],
    mood: "Breezy, romantic, tropical",
  },
};

const religionAddons = {
  hindu: {
    mandap: "Elaborately decorated four-pillared mandap with silk draping and floral garlands",
    entrance: "Toran made of mango leaves and marigold over the main entrance",
    floor: "Rangoli patterns in traditional motifs around the ceremony area",
  },
  muslim: {
    mandap: "Elegant Nikah backdrop with jali screens and rose petal arrangement",
    entrance: "Arched floral entrance with jasmine and mogra",
    floor: "Rich carpet with Moroccan lanterns lining the aisle",
  },
  christian: {
    mandap: "Floral arch at the altar with white roses and cascading greenery",
    entrance: "Church aisle lined with white pew flowers and ribbon bows",
    floor: "Rose petal aisle runner leading to the altar",
  },
};

/**
 * Generate decor suggestions.
 * @param {string} venue   - Venue name
 * @param {string} theme   - royal | traditional | minimalist | beach
 * @param {string} religion - hindu | muslim | christian
 * @param {string} state   - Indian state (optional)
 */
function generateDecorSuggestions({ venue, theme, religion, state }) {
  const themeKey = (theme || "royal").toLowerCase();
  const religionKey = (religion || "hindu").toLowerCase();

  const themeDecor = decorByTheme[themeKey] || decorByTheme["royal"];
  const religionDecor = religionAddons[religionKey] || religionAddons["hindu"];

  // Also pull from weddingData for venue-type-specific detail
  let venueTypeDecor = null;
  try {
    const byRel = decorThemes[religionKey] || decorThemes["hindu"];
    const keys = Object.keys(byRel);
    const vType = keys[0]; // default to first available venue type
    const byTier = byRel[vType];
    const tierKey = Object.keys(byTier)[0];
    venueTypeDecor = byTier[tierKey] || null;
  } catch {}

  return {
    venue,
    theme: themeKey,
    religion: religionKey,
    state: state || "",
    decor: {
      style: venueTypeDecor?.style || themeDecor.mood,
      mood: themeDecor.mood,
      colors: themeDecor.colors,
      flowers: themeDecor.flowers,
      lighting: themeDecor.lighting,
      elements: themeDecor.elements,
      signature: themeDecor.signature,
      religionSpecific: religionDecor,
      aiPrompt: buildImagePrompt(venue, themeKey, religionKey, state),
    },
  };
}

function buildImagePrompt(venue, theme, religion, state) {
  const themeDescriptions = {
    royal: "opulent gold and crystal royal decor with marigold cascades",
    traditional: "traditional Indian decor with marigold, banana leaves and oil diyas",
    minimalist: "minimalist white and blush wedding decor with clean geometric elements",
    beach: "breezy tropical beach wedding with tiki torches and flowing fabric",
  };
  const desc = themeDescriptions[theme] || themeDescriptions.royal;
  return `Indian ${religion} wedding decor at ${venue || "palace"} in ${state || "India"} — ${desc}, cinematic photography, ultra-realistic, 8K`;
}

module.exports = { generateDecorSuggestions };
