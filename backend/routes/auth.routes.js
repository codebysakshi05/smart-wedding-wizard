/**
 * routes/auth.routes.js
 *
 * Exposes authentication endpoints.
 */

const { Router } = require("express");
const { validateRegisterRequest, validateLoginRequest } = require("../utils/validators");
const authController = require("../controllers/auth.controller");

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user.
 */
router.post("/register", validateRegisterRequest, authController.register);

/**
 * POST /api/auth/login
 * Authenticate an existing user.
 */
router.post("/login", validateLoginRequest, authController.login);

module.exports = router;
