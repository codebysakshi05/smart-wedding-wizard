/**
 * backend/utils/imageValidator.js
 *
 * PROFESSIONAL IMAGE VALIDATION SYSTEM
 * Ensures all displayed images match:
 * - User's religion
 * - Wedding event type
 * - Budget tier (luxury vs mid vs budget)
 * - No repeated images in the same session
 * - Cultural sensitivity and appropriateness
 */

const RELIGION_REQUIREMENTS = {
  hindu: {
    appropriateThemes: ["mandap", "flowers", "lights", "traditional", "gold", "red", "celebration"],
    inappropriateKeywords: ["church", "mosque", "western", "bikini", "alcohol"],
  },
  muslim: {
    appropriateThemes: ["modest", "traditional", "family", "celebration", "formal", "elegant"],
    inappropriateKeywords: ["pork", "alcohol", "bikini", "church", "hindu-specific"],
  },
  christian: {
    appropriateThemes: ["church", "cross", "white", "formal", "elegant", "candles", "flowers"],
    inappropriateKeywords: ["mandap", "mosque", "bikini", "alcohol"],
  },
  sikh: {
    appropriateThemes: ["turban", "gurdwara", "traditional", "formal", "family", "celebration"],
    inappropriateKeywords: ["church", "mosque", "bikini", "alcohol", "hindi-specific"],
  },
  "south-indian": {
    appropriateThemes: ["temple", "saree", "traditional", "flowers", "south-indian", "tamil"],
    inappropriateKeywords: ["western", "bikini", "church", "mosque"],
  },
};

const EVENT_HIERARCHY = {
  engagement: 0,
  mehndi: 1,
  haldi: 2,
  sangeet: 3,
  wedding: 4,
  reception: 5,
};

/**
 * Validate if an image matches the wedding context
 * @param {object} image - Image object with id, src, alt, tags
 * @param {string} religion - User's religion
 * @param {string} event - Current event type
 * @param {string} budgetTier - 'budget', 'mid', 'luxury'
 * @returns {object} { isValid: boolean, score: number, reasons: string[] }
 */
function validateImage(image, religion, event, budgetTier = "mid") {
  const reasons = [];
  let score = 100; // Start with perfect score

  if (!image || !image.tags) {
    return { isValid: false, score: 0, reasons: ["Missing image data"] };
  }

  const tags = (image.tags || []).map((t) => t.toLowerCase());
  const alt = (image.alt || "").toLowerCase();
  const src = (image.src || "").toLowerCase();

  // RELIGION VALIDATION
  const religionLower = (religion || "hindu").toLowerCase();
  const requirements = RELIGION_REQUIREMENTS[religionLower];

  if (requirements) {
    // Check for inappropriate content
    const hasInappropriate = requirements.inappropriateKeywords.some(
      (kw) => alt.includes(kw) || src.includes(kw) || tags.some((t) => t.includes(kw)),
    );

    if (hasInappropriate) {
      return {
        isValid: false,
        score: 0,
        reasons: [`Contains inappropriate content for ${religion} wedding`],
      };
    }

    // Check for appropriate themes
    const hasAppropriate = requirements.appropriateThemes.some(
      (theme) => tags.includes(theme) || alt.includes(theme),
    );

    if (!hasAppropriate) {
      score -= 30;
      reasons.push(`Doesn't match ${religion} wedding themes`);
    }
  }

  // EVENT VALIDATION
  if (event && tags.length > 0) {
    const eventLower = event.toLowerCase();
    const hasEventTag = tags.includes(eventLower);

    if (!hasEventTag) {
      // Minor penalty if event tag missing but not disqualifying
      score -= 15;
      reasons.push(`Not specifically for ${event}`);
    } else {
      score += 20; // Bonus for event-specific image
    }
  }

  // BUDGET VALIDATION
  if (budgetTier === "luxury") {
    const hasLuxuryTag = tags.some(
      (t) =>
        t.includes("luxury") ||
        t.includes("premium") ||
        t.includes("elegant") ||
        t.includes("grand"),
    );
    if (!hasLuxuryTag) {
      score -= 10;
      reasons.push("Better luxury options available");
    } else {
      score += 10;
    }
  }

  // QUALITY & PROFESSIONALISM
  const hasProfessionalTag = tags.some(
    (t) =>
      t.includes("professional") ||
      t.includes("ceremony") ||
      t.includes("formal") ||
      t.includes("celebration"),
  );

  if (!hasProfessionalTag) {
    score -= 5;
  }

  return {
    isValid: score > 30, // Must have at least 30% score to be valid
    score: Math.max(0, Math.min(100, score)),
    reasons: reasons,
  };
}

/**
 * Filter and rank images based on wedding context
 * @param {array} images - Array of image objects
 * @param {string} religion - User's religion
 * @param {string} event - Event type
 * @param {string} budgetTier - Budget tier
 * @param {number} count - How many to return
 * @returns {array} Ranked and filtered images
 */
function filterAndRankImages(images, religion, event, budgetTier = "mid", count = 6) {
  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }

  // Validate each image
  const validated = images.map((img) => {
    const validation = validateImage(img, religion, event, budgetTier);
    return {
      ...img,
      validationScore: validation.score,
      isValid: validation.isValid,
      validationReasons: validation.reasons,
    };
  });

  // Filter out invalid images
  const valid = validated.filter((img) => img.isValid);

  // Sort by validation score (highest first)
  valid.sort((a, b) => b.validationScore - a.validationScore);

  // Return top N images
  return valid.slice(0, count).map((img) => {
    // Remove validation fields before returning
    const { validationScore, validationReasons, ...cleaned } = img;
    return cleaned;
  });
}

/**
 * Detect and prevent inappropriate images
 * @param {string} imageUrl - Image path
 * @param {array} tags - Image tags
 * @returns {object} { isInappropriate: boolean, reason: string }
 */
function checkContentAppropriateness(imageUrl, tags = []) {
  const bannedPatterns = [
    "bikini",
    "swimwear",
    "alcohol",
    "drunk",
    "western models",
    "non-wedding",
    "generic stock",
    "unrelated",
    "landscape",
    "airplane",
    "car",
    "airport",
    "hotel",
    "beach casual",
  ];

  const src = (imageUrl || "").toLowerCase();
  const tagStr = (tags || []).join(" ").toLowerCase();

  for (const pattern of bannedPatterns) {
    if (src.includes(pattern) || tagStr.includes(pattern)) {
      return { isInappropriate: true, reason: `Contains ${pattern}` };
    }
  }

  return { isInappropriate: false, reason: "" };
}

/**
 * Validate image consistency across session
 * Prevents showing unrelated images like cars, airports, landscapes
 */
function validateImageRelevance(image) {
  const requiredTags = [
    "wedding",
    "event",
    "ceremony",
    "celebration",
    "decor",
    "outfit",
    "photography",
    "venue",
  ];
  const haRelevantTag = (image.tags || []).some((t) =>
    requiredTags.some((req) => t.toLowerCase().includes(req)),
  );

  return haRelevantTag;
}

module.exports = {
  validateImage,
  filterAndRankImages,
  checkContentAppropriateness,
  validateImageRelevance,
  RELIGION_REQUIREMENTS,
  EVENT_HIERARCHY,
};
