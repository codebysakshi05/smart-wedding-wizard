/**
 * utils/redisClient.js
 * Redis client instance using ioredis.
 * Fails gracefully if Redis is not available so the app can still run.
 */

const Redis = require("ioredis");

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => {
    // Stop retrying after 3 attempts to fail gracefully
    if (times > 3) {
      console.warn("[Redis] Connection failed after 3 attempts. Caching disabled.");
      return null;
    }
    return Math.min(times * 50, 2000);
  },
};

let redisClient = null;

try {
  redisClient = new Redis(redisOptions);

  redisClient.on("error", (err) => {
    // Suppress verbose connection errors after the retry strategy kicks in
    if (err.code !== "ECONNREFUSED") {
      console.warn("[Redis] Error:", err.message);
    }
  });

  redisClient.on("connect", () => {
    console.log("🔌 Connected to Redis");
  });
} catch (err) {
  console.warn("[Redis] Initialization failed. Caching disabled.");
}

module.exports = redisClient;
