/**
 * backend/utils/imageEngine.js
 *
 * LOCAL CURATED WEDDING IMAGE ENGINE
 * - Uses src/data/images.js as the ONLY source
 * - Session-aware to prevent repeated images
 * - No external APIs, 100% reliable
 * - Organized by religion, event, outfit, décor, venue
 */

// Import the centralized image selector
// Note: This will be loaded via require() at runtime
let imageSelector = null;

const getImageSelector = () => {
  if (!imageSelector) {
    try {
      // Try to load a dedicated image selector module if present
      imageSelector =
        require("../../src/data/images").default || require("../../src/data/images").imageSelector;
    } catch (err) {
      // Fallback: build a very small selector from the asset manifest so the backend
      // can return local image URLs even when the rich selector is not present.
      try {
        const manifest = require("../../src/data/assetManifest.json");
        const entries = Object.entries(manifest || {});

        const makeImg = (value, idx) => ({
          id: `${idx}-${value.split("/").pop()}`,
          src: value,
          alt: value.split("/").pop(),
          tags: [],
          path: value,
        });

        const findByParts = (parts = [], limit = 6) => {
          if (!Array.isArray(parts)) parts = [String(parts || "")];
          const found = [];
          for (const [key, value] of entries) {
            const keyLower = key.toLowerCase();
            if (parts.some((p) => p && keyLower.includes(p.toLowerCase()))) {
              found.push(value);
            }
            if (found.length >= limit) break;
          }
          return found.slice(0, limit).map((v, i) => makeImg(v, i));
        };

        imageSelector = {
          getEventImages: (religion, eventName, sessionId, count = 6) =>
            findByParts([eventName, religion, "decor", "hero"], count),
          getDecorImages: (category, sessionId, count = 6) =>
            findByParts([category, "decor"], count),
          getVenueImages: (venueType, sessionId, count = 4) =>
            findByParts([venueType, "venues"], count),
          getBridalOutfits: (religion, sessionId, count = 4) =>
            findByParts([religion, "outfits", "outfits"], count),
          getGroomOutfits: (religion, sessionId, count = 4) =>
            findByParts([religion, "outfits"], count),
          getPhotographyImages: (sessionId, count = 6) =>
            findByParts(["photography", "hero", "ideas"], count),
          getCuratedGallery: (religion, sessionId, count = 24) =>
            findByParts([religion, "hero", "ideas", "decor"], count),
          getVenueImages: (venueType, sessionId, count = 4) =>
            findByParts([venueType, "venues"], count),
          clearSession: (_sessionId) => {},
          getStats: () => ({ count: entries.length }),
        };

        console.log("[ImageEngine] Built fallback image selector from assetManifest.json");
      } catch (e) {
        console.warn("[ImageEngine] Could not build fallback selector:", e.message);
        imageSelector = null;
      }
    }
  }
  return imageSelector;
};

/**
 * Get event images (engagement, mehndi, haldi, sangeet, wedding, reception)
 */
const getEventImages = async (
  eventName,
  religion,
  theme = "",
  budgetTier = "mid",
  count = 6,
  sessionId = "default",
) => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getEventImages(religion, eventName, sessionId, count);
    console.log(
      `[ImageEngine-Local] Fetched ${images.length} images for ${eventName} (${religion})`,
    );
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src, // For backwards compatibility
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching event images:", err);
    return [];
  }
};

/**
 * Get bridal outfit images for a specific religion
 */
const getBrideOutfitImages = async (
  religion,
  theme = "",
  budgetTier = "mid",
  count = 4,
  sessionId = "default",
) => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getBridalOutfits(religion, sessionId, count);
    console.log(`[ImageEngine-Local] Fetched ${images.length} bridal images for ${religion}`);
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching bridal images:", err);
    return [];
  }
};

/**
 * Get groom outfit images for a specific religion
 */
const getGroomOutfitImages = async (
  religion,
  theme = "",
  budgetTier = "mid",
  count = 4,
  sessionId = "default",
) => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getGroomOutfits(religion, sessionId, count);
    console.log(`[ImageEngine-Local] Fetched ${images.length} groom images for ${religion}`);
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching groom images:", err);
    return [];
  }
};

/**
 * Get venue images
 */
const getVenueImages = async (venueType = "palace", count = 4, sessionId = "default") => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getVenueImages(venueType, sessionId, count);
    console.log(`[ImageEngine-Local] Fetched ${images.length} venue images for ${venueType}`);
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching venue images:", err);
    return [];
  }
};

/**
 * Get décor images
 */
const getDecorImages = async (category = "flowers", count = 6, sessionId = "default") => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getDecorImages(category, sessionId, count);
    console.log(`[ImageEngine-Local] Fetched ${images.length} décor images for ${category}`);
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching décor images:", err);
    return [];
  }
};

/**
 * Get photography/moments images
 */
const getPhotographyIdeas = async (count = 6, sessionId = "default") => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getPhotographyImages(sessionId, count);
    console.log(`[ImageEngine-Local] Fetched ${images.length} photography images`);
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching photography images:", err);
    return [];
  }
};

/**
 * Get curated gallery (mixed images for inspiration)
 */
const getCuratedGallery = async (religion, count = 24, sessionId = "default") => {
  const selector = getImageSelector();
  if (!selector) return [];

  try {
    const images = selector.getCuratedGallery(religion, sessionId, count);
    console.log(
      `[ImageEngine-Local] Fetched ${images.length} curated gallery images for ${religion}`,
    );
    return images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
    }));
  } catch (err) {
    console.error("[ImageEngine-Local] Error fetching curated gallery:", err);
    return [];
  }
};

/**
 * Legacy aliases for backwards compatibility
 */
const getEventDecorImages = getEventImages;
const getHoneymoonImages = async (count = 1, sessionId = "default") => {
  return getPhotographyIdeas(count, sessionId); // Fallback to photography
};
const getInvitationImages = async (theme = "", count = 1, sessionId = "default") => {
  return getEventImages("wedding", "hindu", theme, "mid", count, sessionId);
};
const getStageImages = async (count = 1, sessionId = "default") => {
  return getDecorImages("stages", count, sessionId);
};
const getFoodPresentationImages = async (count = 3, sessionId = "default") => {
  return getPhotographyIdeas(count, sessionId); // Fallback to photography
};

/**
 * Clear session tracking
 */
const clearImageMemory = async (sessionId) => {
  const selector = getImageSelector();
  if (selector && selector.clearSession) {
    selector.clearSession(sessionId);
  }
};

/**
 * Get image statistics
 */
const getImageStats = () => {
  const selector = getImageSelector();
  if (selector && selector.getStats) {
    return selector.getStats();
  }
  return {};
};

module.exports = {
  getEventImages,
  getBrideOutfitImages,
  getGroomOutfitImages,
  getVenueImages,
  getDecorImages,
  getPhotographyIdeas,
  getCuratedGallery,
  getEventDecorImages,
  getHoneymoonImages,
  getInvitationImages,
  getStageImages,
  getFoodPresentationImages,
  clearImageMemory,
  getImageStats,
};
