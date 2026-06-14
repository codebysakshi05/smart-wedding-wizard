/**
 * middleware/auth.middleware.js
 *
 * Middleware to protect routes. Verifies the JWT in the Authorization header
 * and attaches the decoded userId to the request object.
 */

const jwt = require("jsonwebtoken");
const { formatErrorResponse } = require("../utils/responseFormatter");

const requireAuth = (req, res, next) => {
  // 1. Extract token from header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(formatErrorResponse("Unauthorized: Missing or invalid token format."));
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    console.error("[AuthMiddleware] Token verification failed:", error.message);
    return res.status(401).json(formatErrorResponse("Unauthorized: Token is invalid or expired."));
  }
};

module.exports = { requireAuth };
