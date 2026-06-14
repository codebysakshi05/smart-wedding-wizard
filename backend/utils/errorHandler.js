/**
 * utils/errorHandler.js
 * Global Express error-handling middleware.
 *
 * notFound   – catches requests that don't match any route
 * errorHandler – formats all thrown errors into a consistent JSON response
 */

const { formatErrorResponse } = require("./responseFormatter");

/**
 * 404 handler – attach after all routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Centralised error handler – attach as the very last middleware.
 * Suppresses stack traces in production.
 */
const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error("[ErrorHandler]", err.stack || err.message);
  }

  res
    .status(statusCode)
    .json(
      formatErrorResponse(
        err.message || "Internal Server Error",
        isProduction ? undefined : err.stack,
      ),
    );
};

module.exports = { notFound, errorHandler };
