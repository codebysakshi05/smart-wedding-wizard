/**
 * utils/promptBuilder.js
 *
 * Dynamically builds rich, event-specific image generation prompts.
 */

const CINEMATIC_SUFFIX =
  "ultra realistic, cinematic lighting, cinematic, 4k, high detail, professional DSLR photography, luxury wedding aesthetics. NO cartoon, NO blurry, photorealistic.";

const EVENT_MODIFIERS = {
  mehndi: "colorful boho, vibrant cushions, floral seating, joyful celebration",
  haldi: "yellow marigold decor, sunlight, outdoor natural lighting, festive and bright",
  sangeet: "cinematic night lighting, DJ stage, grand dance floor, vibrant colors",
  wedding: "luxury mandap, floral aisle, sacred ceremonies, royal palace setting",
  reception: "elegant ballroom, classy lighting, premium seating, grand celebration",
  default: "elegant wedding setup",
};

const BUDGET_MODIFIERS = {
  budget: "simple yet tasteful, modest decoration, charming and intimate",
  mid: "well-decorated, elegant, thoughtfully styled",
  premium:
    "ultra-luxurious palace venues, cascading floral tunnels, crystal chandeliers, breathtaking world-class production value",
};

/**
 * Builds a dynamic DALL-E image generation prompt.
 *
 * @param {object} opts
 * @param {string} opts.eventName    - e.g. "Mehndi", "Haldi"
 * @param {string} opts.religion     - e.g. "hindu", "muslim"
 * @param {string} opts.theme        - e.g. "royal", "floral"
 * @param {string} opts.venueType    - e.g. "palace", "lawn"
 * @param {string} opts.lighting     - e.g. "warm", "cinematic"
 * @param {string} opts.colorPalette - e.g. "pink and gold"
 * @param {string} opts.budgetTier   - "budget", "mid", "premium"
 * @param {string} opts.angle        - e.g. "wide venue shot", "close-up decor details"
 * @returns {string} Complete dynamic prompt
 */
const buildDynamicImagePrompt = ({
  eventName = "wedding",
  religion = "hindu",
  theme = "royal",
  venueType = "banquet",
  lighting,
  colorPalette,
  budgetTier = "mid",
  angle = "cinematic perspective",
}) => {
  // Normalize
  const eventLower = eventName.toLowerCase();
  const eventKey = Object.keys(EVENT_MODIFIERS).find((k) => eventLower.includes(k)) || "default";
  const eventMod = EVENT_MODIFIERS[eventKey];
  const budgetMod = BUDGET_MODIFIERS[budgetTier] || BUDGET_MODIFIERS.mid;

  const colorStr = colorPalette
    ? `with a ${colorPalette} color palette`
    : `styled with ${theme} colors`;
  const lightStr = lighting ? `${lighting} lighting` : "beautiful ambient lighting";

  return (
    `${angle} of a ${religion} ${eventName} at a ${venueType}. ` +
    `Theme: ${theme}. ${colorStr}. ` +
    `Vibe: ${eventMod}. ` +
    `${budgetMod}. ` +
    `${lightStr}. ` +
    CINEMATIC_SUFFIX
  ).trim();
};

const buildUpdateDesignPrompt = ({ theme, color, lighting }) => {
  return (
    `A stunning ${theme} wedding setup, ` +
    `decorations in ${color} colors, ` +
    `${lighting} lighting, ` +
    CINEMATIC_SUFFIX
  );
};

module.exports = { buildDynamicImagePrompt, buildUpdateDesignPrompt };
