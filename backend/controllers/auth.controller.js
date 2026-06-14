/**
 * controllers/auth.controller.js
 *
 * HTTP layer for user authentication endpoints.
 */

const authService = require("../services/auth.service");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");
const { validationResult } = require("../utils/validators");

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrorResponse("Validation failed", errors.array()));
  }

  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });

    return res.status(201).json(formatSuccessResponse("User registered successfully", result));
  } catch (error) {
    console.error("[AuthController] Register Error:", error.message);
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json(formatErrorResponse(error.message || "An unexpected error occurred"));
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrorResponse("Validation failed", errors.array()));
  }

  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return res.status(200).json(formatSuccessResponse("Login successful", result));
  } catch (error) {
    console.error("[AuthController] Login Error:", error.message);
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json(formatErrorResponse(error.message || "An unexpected error occurred"));
  }
};

module.exports = {
  register,
  login,
};
