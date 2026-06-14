/**
 * utils/db.js
 * Mongoose database connection initialization.
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("[MongoDB] No MONGO_URI provided in .env. Skipping database connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error: ${error.message}`);
    // Do not exit process, allow the app to run without DB for mock environments
    console.warn("[MongoDB] Failed to connect. Database features will be disabled.");
  }
};

module.exports = connectDB;
