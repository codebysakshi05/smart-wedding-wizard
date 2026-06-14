/**
 * controllers/image.controller.js
 * HTTP layer for the POST /api/generate-image endpoint.
 * Delegates all generation logic to ImageService.
 */

const crypto = require("crypto");
const imageService = require("../services/image.service");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const { validationResult } = require("../utils/validators");

// Simple in-memory cache for demo stability
const imageCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * POST /api/generate-image
 *
 * Body  : { theme: string, budget?: number, color?: string, lighting?: string, style?: string | string[] }
 * Returns: { success: true, requestId, data: { images: string[] }, meta: { source, durationMs, stylesUsed, count } }
 */
const generateImage = async (req, res) => {
  // 1. Debug API Flow: Log incoming request body
  console.log(`[API][${req.requestId}] POST /api/generate-image - Body:`, JSON.stringify(req.body));

  // Validation errors from middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(
      `[API][${req.requestId}] Validation Errors:`,
      JSON.stringify(errors.array(), null, 2),
    );
    return res.status(400).json(formatErrorResponse("Invalid input", errors.array()));
  }

  const { theme, budget, color, lighting, style, venueType } = req.body;
  const forceFallback = req.query.forceFallback === "true";

  // Normalize styles: trim, lowercase, deduplicate, clamp to 3
  let rawStyles = ["luxury", "minimal", "traditional"]; // Internal default
  if (style) {
    rawStyles = Array.isArray(style) ? style : [style];
  }

  const normalizedStyles = [
    ...new Set(rawStyles.filter((s) => typeof s === "string").map((s) => s.trim().toLowerCase())),
  ]
    .filter(Boolean)
    .slice(0, 3);

  // Ensure styles array is never empty
  if (normalizedStyles.length === 0) {
    normalizedStyles.push("garden");
  }

  // 2. Cache check (skip if forceFallback)
  const cacheKey = crypto
    .createHash("md5")
    .update(`${theme}|${budget}|${color}|${lighting}|${normalizedStyles.join(",")}|${venueType}`)
    .digest("hex");

  if (!forceFallback && imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    if (Date.now() < cached.expiry) {
      console.log(`[API][${req.requestId}] Serving cached image generation for key: ${cacheKey}`);
      return res.status(200).json({
        ...cached.data,
        requestId: req.requestId, // use current requestId
      });
    }
  }

  try {
    const startMs = Date.now();
    const result = await imageService.generateWeddingImages({
      theme,
      budget: budget ? Number(budget) : undefined,
      color,
      lighting,
      styles: normalizedStyles,
      venueType,
      sessionId: req.user?.id || req.requestId,
    });
    const durationMs = Date.now() - startMs;

    // 5. Validate Image URLs: filter local image paths
    let images = result
      .map((img) => img?.src)
      .filter((url) => typeof url === "string" && url.length > 0);

    images = images.slice(0, 3);

    // 3. Guarantee Images: if empty, replace with fallback images from our central system
    if (images.length === 0) {
      console.warn(
        `[API][${req.requestId}] No valid images generated – using central image system fallback.`,
      );
      const fallbackPool = await imageService.generateWeddingImages({
        theme: theme || normalizedStyles[0],
        sessionId: req.user?.id || req.requestId,
      });
      images = fallbackPool.map((img) => img.src).filter(Boolean);
    }

    const source = forceFallback
      ? "fallback"
      : result.some((img) => img.source === "ai")
        ? "ai"
        : "fallback";
    const stylesUsed = result.map((img) => img.style).slice(0, images.length);
    const promptsUsed = result.map((img) => img.prompt).slice(0, images.length);

    // 7. Add Debug Logs
    const isFallback = source === "fallback" || forceFallback;
    console.log(
      `[API] generate-image styles=[${normalizedStyles.join(", ")}] count=${images.length} fallback=${isFallback}`,
    );
    console.log(
      `[API] Prompts sent to AI:\n${promptsUsed.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}`,
    );

    const responsePayload = {
      success: true,
      requestId: req.requestId,
      data: {
        images,
      },
      meta: {
        source,
        durationMs,
        stylesUsed,
        promptsUsed,
        count: images.length,
      },
    };

    // Cache the successful result
    if (!forceFallback && !isFallback) {
      imageCache.set(cacheKey, {
        expiry: Date.now() + CACHE_TTL,
        data: responsePayload,
      });
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error(`[API][${req.requestId}] POST /api/generate-image Error:`, error.message);

    // Trigger central image system fallback automatically
    const sessionId = req.user?.id || req.requestId;
    const images = (
      await imageService.generateWeddingImages({ theme: normalizedStyles[0], sessionId })
    )
      .map((img) => img.src)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      requestId: req.requestId,
      data: { images },
      meta: {
        source: "fallback",
        durationMs: 0,
        stylesUsed: normalizedStyles,
        promptsUsed: [],
        count: images.length,
      },
    });
  }
};

/**
 * POST /api/update-design
 *
 * Body  : { theme: string, color: string, lighting: string }
 * Returns: { imageUrl, prompt, revisedPrompt, isMock }
 */
const updateDesign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrorResponse("Validation failed", errors.array()));
  }

  const { theme, color, lighting } = req.body;

  try {
    const startMs = Date.now();
    const result = await imageService.updateDesignImage({
      theme,
      color,
      lighting,
      sessionId: req.user?.id || req.requestId,
    });
    const durationMs = Date.now() - startMs;
    const source = result.source || "ai";

    return res
      .status(200)
      .json(formatSuccessResponse("Design updated successfully", result, { source, durationMs }));
  } catch (error) {
    console.error("[ImageController] updateDesign Error:", error.message);

    const statusCode = error.statusCode || 500;
    const userMessage =
      statusCode === 401
        ? "Invalid OpenAI API key. Please check your .env configuration."
        : statusCode === 429
          ? "OpenAI rate limit reached. Please wait and try again."
          : statusCode === 400
            ? "Image request was rejected by content policy. Try a different theme or style."
            : statusCode === 502
              ? "Could not reach the DALL-E service. Please try again shortly."
              : error.message || "An unexpected error occurred";

    return res.status(statusCode).json(formatErrorResponse(userMessage));
  }
};

module.exports = { generateImage, updateDesign };
