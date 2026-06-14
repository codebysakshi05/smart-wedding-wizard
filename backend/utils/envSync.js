/**
 * backend/utils/envSync.js
 * Utility to synchronize backend configuration with the frontend .env file.
 */

const fs = require("fs");
const path = require("path");

/**
 * Updates the VITE_API_BASE in the root .env file.
 * @param {number} port
 */
const syncFrontendPort = (port) => {
  try {
    const rootEnvPath = path.join(__dirname, "../../.env");

    if (!fs.existsSync(rootEnvPath)) {
      console.warn("  \x1b[33m⚠ Root .env file not found. Skipping frontend sync.\x1b[0m");
      return;
    }

    let content = fs.readFileSync(rootEnvPath, "utf8");
    const newApiBase = `http://localhost:${port}`;

    if (content.includes("VITE_API_BASE=")) {
      content = content.replace(/VITE_API_BASE=.*/, `VITE_API_BASE=${newApiBase}`);
    } else {
      content += `\nVITE_API_BASE=${newApiBase}\n`;
    }

    fs.writeFileSync(rootEnvPath, content, "utf8");
    console.log(`  \x1b[32m✅ Frontend synchronized: VITE_API_BASE=${newApiBase}\x1b[0m`);
  } catch (error) {
    console.error(`  \x1b[31m❌ Failed to sync frontend port: ${error.message}\x1b[0m`);
  }
};

module.exports = { syncFrontendPort };
