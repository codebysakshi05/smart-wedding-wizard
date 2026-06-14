/**
 * utils/validators.js
 * express-validator middleware for all API endpoints.
 *
 * Exports:
 *   validatePlanRequest         – POST /api/generate-plan
 *   validateImageRequest        – POST /api/generate-image
 *   validateUpdateDesignRequest – POST /api/update-design
 *   validateChatRequest         – POST /api/chat
 *   validateRegisterRequest     – POST /api/auth/register
 *   validateLoginRequest        – POST /api/auth/login
 */

const { body, validationResult } = require("express-validator");

/** Allowed priority values – updated to match frontend */
const ALLOWED_PRIORITIES = [
  "luxury_decor",
  "budget_friendly",
  "destination_wedding",
  "photography",
  "outdoor_wedding",
  "celebrity_style",
  "traditional_rituals",
  "modern_theme",
  "minimalist_wedding",
  // Legacy support
  "venue",
  "catering",
  "decoration",
  "misc",
];

/**
 * Validation chain for the generate-plan request body.
 */
const validatePlanRequest = [
  body("budget")
    .notEmpty()
    .withMessage("budget is required")
    .isNumeric()
    .withMessage("budget must be a number")
    .isFloat({ min: 1000 })
    .withMessage("budget must be at least $1,000"),

  body("guests")
    .notEmpty()
    .withMessage("guests is required")
    .custom((value) => {
      const num = Number(value);
      if (!Number.isInteger(num)) throw new Error("guests must be an integer");
      if (num < 1 || num > 10000) throw new Error("guests must be between 1 and 10,000");
      return true;
    }),

  body("theme")
    .notEmpty()
    .withMessage("theme is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("theme must be between 2 and 100 characters"),

  body("location")
    .notEmpty()
    .withMessage("location is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("location must be between 2 and 200 characters"),

  body("priority")
    .optional()
    .isIn(ALLOWED_PRIORITIES)
    .withMessage(`priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}`),

  body("priorities")
    .optional()
    .isArray()
    .withMessage("priorities must be an array")
    .custom((value) => {
      if (!value.every((p) => ALLOWED_PRIORITIES.includes(p))) {
        throw new Error(`priorities must contain only allowed values`);
      }
      return true;
    }),

  body("religion").optional().isString().trim(),

  body("venue").optional().isObject().withMessage("venue must be an object"),
];

/* ─── Image Generation Validator ────────────────────────────── */

/**
 * Allowed wedding style values for the image generator.
 * Partial matches are handled in promptBuilder.js, so only basic
 * length / type checks are needed here.
 */
const ALLOWED_STYLES = [
  "royal",
  "luxury",
  "rustic",
  "boho",
  "garden",
  "beach",
  "modern",
  "traditional",
  "floral",
  "rustic boho",
  "floral garden",
  "royal luxury",
];

/**
 * Validation chain for POST /api/generate-image.
 */
const validateImageRequest = [
  body("theme")
    .notEmpty()
    .withMessage("theme is required")
    .isString()
    .withMessage("theme must be a string")
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage("theme must be between 2 and 1000 characters"),

  body("budget")
    .optional()
    .isNumeric()
    .withMessage("budget must be a number")
    .isFloat({ min: 1000 })
    .withMessage("budget must be at least ₹1,000"),

  body("style")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every((s) => typeof s === "string");
      }
      return typeof value === "string";
    })
    .withMessage("style must be a string or an array of strings"),

  body("color").optional().isString().withMessage("color must be a string").trim(),

  body("lighting").optional().isString().withMessage("lighting must be a string").trim(),
];

/**
 * Validation chain for POST /api/update-design.
 */
const validateUpdateDesignRequest = [
  body("theme")
    .notEmpty()
    .withMessage("theme is required")
    .isString()
    .withMessage("theme must be a string")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("theme must be between 2 and 120 characters"),

  body("color")
    .notEmpty()
    .withMessage("color is required")
    .isString()
    .withMessage("color must be a string")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("color must be between 2 and 80 characters"),

  body("lighting")
    .notEmpty()
    .withMessage("lighting is required")
    .isString()
    .withMessage("lighting must be a string")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("lighting must be between 2 and 80 characters"),
];

/**
 * Validation chain for POST /api/chat.
 */
const validateChatRequest = [
  body("message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message must be a string")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("message must be between 1 and 2000 characters"),

  body("history").optional().isArray().withMessage("history must be an array of message objects"),

  body("history.*.role")
    .optional()
    .isIn(["user", "assistant"])
    .withMessage("role must be user or assistant"),

  body("history.*.content").optional().isString().withMessage("content must be a string"),
];

/**
 * Validation chain for POST /api/auth/register.
 */
const validateRegisterRequest = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("name must be between 2 and 100 characters"),

  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
];

/**
 * Validation chain for POST /api/auth/login.
 */
const validateLoginRequest = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string"),
];

/**
 * Validation chain for POST /api/save-plan.
 */
const validateSavePlanRequest = [
  body("plan")
    .notEmpty()
    .withMessage("plan object is required")
    .isObject()
    .withMessage("plan must be an object"),

  body("budget")
    .notEmpty()
    .withMessage("budget is required")
    .isNumeric()
    .withMessage("budget must be a number"),

  body("theme")
    .notEmpty()
    .withMessage("theme is required")
    .isString()
    .withMessage("theme must be a string")
    .trim(),

  body("guests")
    .notEmpty()
    .withMessage("guests is required")
    .isInt({ min: 1 })
    .withMessage("guests must be a positive integer"),

  body("images").optional().isArray().withMessage("images must be an array of strings"),
];

const customValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      field: error.path,
      issue: error.msg,
    };
  },
});

module.exports = {
  validatePlanRequest,
  validateImageRequest,
  validateUpdateDesignRequest,
  validateChatRequest,
  validateRegisterRequest,
  validateLoginRequest,
  validateSavePlanRequest,
  validationResult: customValidationResult,
};
