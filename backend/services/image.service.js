/**
 * services/image.service.js
 *
 * PROFESSIONAL IMAGE SERVICE FOR DREAM WEAVER
 * - Returns ONLY curated local wedding images
 * - Validates all images match religion, event, budget
 * - Prevents inappropriate/unrelated images
 * - Session-aware deduplication
 * - No external APIs, 100% reliable
 */

const imageEngine = require("../utils/imageEngine");
const imageValidator = require("../utils/imageValidator");

/**
 * Generate wedding images from local curated collection
 * Returns professional, religion-appropriate images only
 */
const generateWeddingImages = async ({
  eventName,
  religion,
  theme,
  venueType,
  lighting,
  colorPalette,
  budgetTier,
  angles = [],
  sessionId = null,
}) => {
  console.log(`[Image Service] Generating local images for ${eventName || theme || "wedding"}`);

  try {
    // Use centralized image engine - no randomness, no external APIs
    const images = await imageEngine.getEventImages(
      eventName,
      religion,
      theme,
      budgetTier || "mid",
      angles.length > 0 ? angles.length : 5,
      sessionId || "default",
    );

    // VALIDATE IMAGES: Ensure they match user's religion, event, and budget
    const validated = imageValidator.filterAndRankImages(
      images,
      religion || "hindu",
      eventName || "wedding",
      budgetTier || "mid",
      Math.min(images.length, 6),
    );

    // Return in the same format the frontend expects
    return validated.map((img, idx) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      tags: img.tags,
      path: img.src,
      angle: angles[idx] || "standard",
      style: angles[idx] || "standard",
      isMock: false,
      source: "local",
      isValidated: true,
      revisedPrompt: `${eventName} - ${religion} - ${theme}`,
    }));
  } catch (err) {
    console.error("[Image Service] Error generating images:", err);
    return [];
  }
};

/**
 * Update design image - returns single curated image
 * Validates that it's appropriate for the user's wedding context
 */
const updateDesignImage = async ({
  theme,
  color,
  lighting,
  religion = "hindu",
  sessionId = null,
}) => {
  try {
    const images = await imageEngine.getDecorImages(
      "flowers", // Default to floral décor
      6,
      sessionId || "default",
    );

    // Validate and select the best matching décor image
    const validated = imageValidator.filterAndRankImages(images, religion, "wedding", "mid", 1);

    if (validated.length > 0) {
      const img = validated[0];
      return {
        id: img.id,
        src: img.src,
        alt: img.alt,
        tags: img.tags,
        path: img.src,
        style: "modern",
        isMock: false,
        source: "local",
        isValidated: true,
      };
    }

    return {
      src: null,
      alt: "Décor image",
      source: "local",
      isMock: true,
    };
  } catch (err) {
    console.error("[Image Service] Error updating design image:", err);
    return {
      src: null,
      alt: "Décor image",
      source: "local",
      isMock: true,
    };
  }
};

module.exports = {
  generateWeddingImages,
  updateDesignImage,
};
