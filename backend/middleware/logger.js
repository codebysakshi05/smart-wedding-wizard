/**
 * middleware/logger.js
 * Logs incoming API requests for better debugging and monitoring.
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const reqId = req.requestId ? `[${req.requestId.substring(0, 8)}] ` : "";

    // Minimal readable log format
    console.log(`[API] ${reqId}${method} ${url} - ${status} (${duration}ms)`);
  });

  next();
};

module.exports = { requestLogger };
