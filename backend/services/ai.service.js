/**
 * services/ai.service.js
 *
 * OpenAI integration for the Dream Weaver wedding planner.
 *
 * Key design decisions:
 *  • Uses `response_format: { type: "json_object" }` (JSON mode) so GPT is
 *    guaranteed to return parseable JSON – no regex extraction needed.
 *  • The system prompt defines the exact output schema, field by field.
 *  • Falls back to a deterministic mock that honours the same JSON schema,
 *    keeping the server fully functional without an API key.
 */

const OpenAI = require("openai");
const { withTimeout } = require("../utils/timeout");

/* ─── Client ─────────────────────────────────────────────────── */

let openaiClient = null;

/** Lazily initialise to avoid crashing on startup when no key is set. */
const getClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

/* ─── System Prompt ──────────────────────────────────────────── */

/**
 * Instructs the model to return ONLY a JSON object matching the schema below.
 * JSON mode still requires the word "json" to appear in the system prompt.
 */
const SYSTEM_PROMPT = `
You are an expert wedding planner with 20 years of experience crafting elegant,
personalised, and practical weddings across India and internationally.

Your task is to generate a complete wedding plan as a single valid JSON object.
Do NOT include any markdown, code fences, prose, or commentary outside the JSON.

The JSON object MUST follow this exact schema:

{
  "options": [
    {
      "version": "<String indicating the variation, e.g. 'Budget Version', 'Standard Version', or 'Premium Version'>",
      "theme": "<One-line theme title, e.g. 'Rustic Boho Garden Wedding'>",
      
      "venue": {
        "name": "<Venue name and city>",
        "description": "<2–3 sentences about why this venue suits the theme>",
        "capacity": "<e.g. 'Up to 200 guests'>",
        "highlights": ["<feature 1>", "<feature 2>", "<feature 3>"]
      },
      
      "decor": {
        "palette": "<Colour palette, e.g. 'Blush, ivory, and sage green'>",
        "style": "<Decor style descriptor>",
        "elements": ["<element 1>", "<element 2>", "<element 3>", "<element 4>", "<element 5>"],
        "florals": "<Floral description>"
      },
      
      "catering": {
        "style": "<Service style, e.g. 'Plated four-course dinner' or 'Buffet'>",
        "menu": ["<menu item 1>", "<menu item 2>", "<menu item 3>"],
        "beverages": "<Beverage options>",
        "cake": "<Wedding cake description>"
      },
      
      "budgetBreakdown": {
        "venue": <number in INR>,
        "catering": <number in INR>,
        "decoration": <number in INR>,
        "photography": <number in INR>,
        "misc": <number in INR>
      },
      
      "suggestions": [
        "<Actionable tip 1>",
        "<Actionable tip 2>",
        "<Actionable tip 3>",
        "<Actionable tip 4>",
        "<Actionable tip 5>"
      ]
    }
  ]
}

Rules:
- budgetBreakdown values must be numbers (not strings).
- suggestions must be concise, actionable, and relevant to the priority and budget tier.
- DECORATION LOGIC: Tailor the 'decor' section to the specific venue type. For example, if it's a beach, use breezy/pastel/natural elements. If it's a banquet hall, use more formal/grand/structured elements.
- All amounts are in Indian Rupees (INR).
- Ensure response is clean and consistent. Avoid long paragraphs; use short, clear descriptions and bullet points where appropriate.
`.trim();

/* ─── Public API ─────────────────────────────────────────────── */

/**
 * Calls GPT-4o-mini in JSON mode and returns the raw JSON string.
 * Falls back to a schema-compliant mock when no API key is configured.
 *
 * @param {string} userPrompt  - The assembled user-facing prompt
 * @param {object} ctx         - Context for mock personalisation
 * @param {string} ctx.theme
 * @param {string} ctx.location
 * @returns {Promise<string>}  - Raw JSON string (always parseable)
 */
const generateStructuredPlan = async (userPrompt, { theme, location, venueType } = {}) => {
  const client = getClient();

  if (!client) {
    console.warn("[AI Service] No OPENAI_API_KEY – returning structured mock.");
    return {
      raw: getMockJson({ theme, location, venueType }),
      source: "mock",
      reason: "no_api_key",
    };
  }

  try {
    const aiPromise = client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.75,
      max_tokens: 1800,
    });

    const completion = await withTimeout(aiPromise, 10000);

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error("Empty response from OpenAI");

    return { raw, source: "ai" };
  } catch (err) {
    if (err.isTimeout) {
      console.warn("[AI Service] Request timed out. Returning structured mock.");
      return {
        raw: getMockJson({ theme, location, venueType }),
        source: "mock",
        reason: "timeout",
      };
    }
    // Surface meaningful errors (rate-limit, invalid key, network, etc.)
    const statusCode = err.status || err.statusCode;
    const enhanced = new Error(`OpenAI error: ${err.message}`);
    enhanced.statusCode = statusCode === 401 ? 401 : statusCode === 429 ? 429 : 502;
    throw enhanced;
  }
};

/* ─── Mock Fallback ──────────────────────────────────────────── */

/**
 * Returns a JSON string that perfectly matches the schema.
 * Personalised with the user's theme and location.
 *
 * @param {{ theme?: string, location?: string }} ctx
 * @returns {string}
 */
const getMockJson = ({
  theme = "Elegant",
  location = "your chosen venue",
  venueType = "resort",
} = {}) => {
  const createMockOption = (version) => {
    const venueDesc =
      venueType === "beach"
        ? `A stunning beachside setup in ${location} with sunset views and sandy aisles.`
        : venueType === "palace" || venueType === "hotel"
          ? `A grand ballroom in ${location} with crystal chandeliers and regal architecture.`
          : `A beautiful ${venueType} in ${location} with versatile spaces for your celebration.`;

    const decorStyle =
      venueType === "beach"
        ? "Coastal Chic"
        : venueType === "palace"
          ? "Royal Splendor"
          : `${theme} Classic`;

    return {
      version,
      theme: `${theme} Wedding in ${location} (${version})`,

      venue: {
        name: `Heritage ${venueType.charAt(0).toUpperCase() + venueType.slice(1)} Estate, ${location}`,
        description: venueDesc,
        capacity: "Up to 300 guests",
        highlights: [
          `Sprawling ${venueType === "beach" ? "shoreline" : "garden"} for the ceremony`,
          "Climate-controlled grand ballroom for the reception",
          "Dedicated bridal suite and groom's lounge",
        ],
      },

      decor: {
        palette:
          venueType === "beach"
            ? "Aqua, sand, and coral"
            : "Soft ivory, blush rose, and sage green",
        style: decorStyle,
        elements: [
          venueType === "beach"
            ? "Driftwood arches with white linen"
            : "Cascading floral arches of white roses",
          "Fairy-light canopy draped across the reception ceiling",
          "Personalised vow booklets tied with satin ribbon",
          "Lush centrepieces matching the theme",
          "Candlelit lanterns lining the entrance pathway",
        ],
        florals: "Seasonal blooms tailored to the theme and venue",
      },

      catering: {
        style: "Plated four-course dinner featuring local seasonal ingredients",
        menu: [
          "Delicate amuse-bouche to start",
          "Fresh garden salad with house vinaigrette",
          "Choice of premium main courses",
        ],
        beverages: "Signature cocktails and premium selections",
        cake: "Bespoke three-tier wedding cake",
      },

      budgetBreakdown: {},

      suggestions: [
        `Book your venue in ${location} at least 12 months in advance.`,
        "Reserve 10–15 % of your total budget as a contingency fund.",
        "Invest in great food and live music.",
        "Hire a dedicated day-of coordinator.",
        "Choose 2–3 deeply personal décor touches.",
      ],
    };
  };

  const plan = {
    options: [
      createMockOption("Budget Version"),
      createMockOption("Standard Version"),
      createMockOption("Premium Version"),
    ],
  };

  return JSON.stringify(plan);
};

module.exports = { generateStructuredPlan, getMockJson };
