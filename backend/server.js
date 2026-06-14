/**
 * server.js – Entry point for the Dream Weaver AI Wedding Planner API.
 * Bootstraps the Express app and starts the HTTP server.
 */

require("dotenv").config();

const app = require("./app");
const connectDB = require("./utils/db");
const { isPortAvailable } = require("./utils/portFinder");

const startServer = async () => {
  console.log("\n\x1b[35m✨ Dream Weaver AI - Initializing Systems...\x1b[0m");

  // 1. Connect to Database
  await connectDB();

  // 2. Port Management
  const PORT = process.env.PORT || 5000;

  // Verify port 5000 availability
  const isAvailable = await isPortAvailable(PORT);
  if (!isAvailable) {
    console.error(
      `\x1b[31m❌ Port ${PORT} is occupied. Please kill any hanging processes before starting.\x1b[0m`,
    );
    console.log(`   \x1b[33mTry: taskkill /F /IM node.exe /T\x1b[0m`);
    process.exit(1);
  }

  // 3. Start HTTP Server
  const server = app.listen(PORT, () => {
    console.log(`\n\x1b[32m🌸 Dream Weaver API is LIVE on port ${PORT}\x1b[0m`);
    console.log(`   \x1b[36mEnvironment\x1b[0m : ${process.env.NODE_ENV || "development"}`);
    console.log(`   \x1b[36mHealth check\x1b[0m: http://localhost:${PORT}/api/health\n`);
  });

  // Graceful Shutdown Handler
  const gracefulShutdown = async () => {
    console.log("\n\x1b[33m[Server] Shutting down gracefully...\x1b[0m");

    server.close(() => {
      console.log("\x1b[32m[Server] HTTP server closed.\x1b[0m");
    });

    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("\x1b[32m[MongoDB] Connection closed.\x1b[0m");
    }

    const redisClient = require("./utils/redisClient");
    if (redisClient && typeof redisClient.quit === "function") {
      await redisClient.quit();
      console.log("\x1b[32m[Redis] Connection closed.\x1b[0m");
    }

    process.exit(0);
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
};

// Fire it up
startServer();
