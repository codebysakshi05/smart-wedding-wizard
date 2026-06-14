/**
 * generate-asset-manifest.cjs
 *
 * Run this script to scan public/assets and generate src/data/assetManifest.json
 * which maps folder paths to their first valid image URL.
 *
 * Usage: node generate-asset-manifest.cjs
 */

const fs = require("fs");
const path = require("path");

const IMAGE_EXTENSIONS = new Set([".webp", ".avif", ".jpg", ".jpeg", ".png", ".gif"]);
const publicDir = path.join(__dirname, "public");
const outputFile = path.join(__dirname, "src", "data", "assetManifest.json");

// Map: "/assets/categories/beach/mid" -> "/assets/categories/beach/mid/cover.webp"
const manifest = {};

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function scanDir(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (e) {
    return;
  }

  const imageFiles = entries.filter((e) => e.isFile() && isImageFile(e.name));
  const subdirs = entries.filter((e) => e.isDirectory());

  if (imageFiles.length > 0) {
    // Found at least one image - record the first one
    const firstImage = imageFiles[0];
    // Convert absolute path to public-relative URL path
    const absolutePath = path.join(dirPath, firstImage.name);
    const relativePath = absolutePath.replace(publicDir, "").replace(/\\/g, "/");

    // Key is the folder path (without leading public)
    const folderKey = dirPath.replace(publicDir, "").replace(/\\/g, "/");
    manifest[folderKey] = relativePath;
  }

  // Recurse into subdirectories
  for (const subdir of subdirs) {
    scanDir(path.join(dirPath, subdir.name));
  }
}

console.log("Scanning public/assets...");
const assetsDir = path.join(publicDir, "assets");
scanDir(assetsDir);

const count = Object.keys(manifest).length;
console.log(`Found ${count} image folders`);

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log(`✅ Manifest written to ${outputFile}`);
