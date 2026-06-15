/**
 * app.js – Express application factory.
 * Wires up middleware, routes, and global error handling.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");

const plannerRouter = require("./routes/planner.routes");
const imageRouter = require("./routes/image.routes");
const chatRouter = require("./routes/chat.routes");
const authRouter = require("./routes/auth.routes");
const analyticsRouter = require("./routes/analytics.routes");
const dashboardRouter = require("./routes/dashboard.routes");
const exportRouter = require("./routes/export.routes");
const venueRouter = require("./routes/venue.routes");
const weddingPlannerRouter = require("./routes/weddingPlanner.routes");
const { notFound, errorHandler } = require("./utils/errorHandler");
const { requestLogger } = require("./middleware/logger");

const app = express();

// Disable x-powered-by
app.disable("x-powered-by");

// Add security headers
// Allow cross-origin resource policy for assets so frontend at a different origin (e.g. Vite dev server)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Add Request ID and intercept JSON to append requestId
app.use((req, res, next) => {
  req.requestId = uuidv4();
  const originalJson = res.json;
  res.json = function (body) {
    if (body && typeof body === "object") {
      body.requestId = req.requestId;
    }
    return originalJson.call(this, body);
  };
  next();
});

// Rate limiting for /api/*
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after a minute",
  },
});
app.use("/api/", apiLimiter);

/* ─── Middleware ─────────────────────────────────────────────── */

// CORS – allow requests from the configured frontend origin or localhost in dev
// In production, use CORS_ORIGIN env var (comma-separated). Falls back to "*" if not set.
const corsOriginEnv = process.env.CORS_ORIGIN;
const allowedOrigins = corsOriginEnv
  ? corsOriginEnv.split(",").map((o) => o.trim())
  : ["*"];

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Log all requests
app.use(requestLogger);

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve public assets (images, etc.) so API-returned '/assets/...' URLs are reachable
app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));

/* ─── Routes ─────────────────────────────────────────────────── */

// Health check and status
const healthCheckHandler = (_req, res) => {
  res.json({
    status: "ok",
    service: "Dream Weaver AI Wedding Planner API",
    timestamp: new Date().toISOString(),
  });
};

app.get("/api/health", healthCheckHandler);
app.get("/api/status", healthCheckHandler);

// Auth routes     →  /api/auth/register, /api/auth/login
app.use("/api/auth", authRouter);

// Planner routes  →  /api/generate-plan
app.use("/api", plannerRouter);

// Image routes    →  /api/generate-image, /api/update-design
app.use("/api", imageRouter);

// Chat routes     →  /api/chat
app.use("/api", chatRouter);

// Dashboard routes → /api/save-plan, /api/my-plans, /api/plan/:id
app.use("/api", dashboardRouter);

// Export and Sharing routes → /api/export-plan/:id, /api/share-plan/:id
app.use("/api", exportRouter);

// Venue routes → /api/venues, /api/venues/recommend
app.use("/api/venues", venueRouter);

// Full Indian Wedding Planner → /api/wedding-plan
app.use("/api", weddingPlannerRouter);

// Analytics routes → /api/analytics
app.use("/api/analytics", analyticsRouter);

/* ─── Error Handling ─────────────────────────────────────────── */

app.use(notFound);
app.use(errorHandler);

module.exports = app;
