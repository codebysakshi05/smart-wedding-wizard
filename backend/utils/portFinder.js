/**
 * backend/utils/portFinder.js
 * Utility to find the next available port using the net module.
 */

const net = require("net");

/**
 * Checks if a specific port is available.
 * @param {number} port
 * @returns {Promise<boolean>}
 */
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(false);
        } else {
          resolve(false);
        }
      })
      .once("listening", () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
};

/**
 * Recursively finds the first available port starting from startPort.
 * @param {number} startPort
 * @param {number} maxAttempts
 * @returns {Promise<number>}
 */
const findAvailablePort = async (startPort, maxAttempts = 10) => {
  let currentPort = parseInt(startPort);
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (await isPortAvailable(currentPort)) {
      return currentPort;
    }

    console.log(`  \x1b[33m⚠ Port ${currentPort} busy, trying ${currentPort + 1}...\x1b[0m`);
    currentPort++;
    attempts++;
  }

  throw new Error(`Could not find an available port after ${maxAttempts} attempts.`);
};

module.exports = { findAvailablePort, isPortAvailable };
