/**
 * routes/image.routes.js
 * Exposes the image generation endpoint.
 *
 * POST /api/generate-image
 *   Body: { theme, budget, style }
 */

const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { validateImageRequest, validateUpdateDesignRequest } = require("../utils/validators");
const { requireAuth } = require("../middleware/auth.middleware");
const imageController = require("../controllers/image.controller");

const router = Router();

// Stricter rate limit for image generation: 30 requests per minute
const imageGenerationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Image generation rate limit reached. Please wait a moment.",
  },
});

/**
 * POST /api/generate-image
 * Generate a DALL-E 3 wedding image from theme, budget, and style inputs.
 */
router.post(
  "/generate-image",
  requireAuth,
  imageGenerationLimiter,
  validateImageRequest,
  imageController.generateImage,
);

/**
 * POST /api/update-design
 * Update a DALL-E 3 wedding image using theme, color, and lighting inputs.
 */
router.post(
  "/update-design",
  requireAuth,
  validateUpdateDesignRequest,
  imageController.updateDesign,
);

module.exports = router;
