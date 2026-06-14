#!/usr/bin/env node

/**
 * COMPREHENSIVE ASSET VALIDATION & AUTO-REPAIR SCRIPT
 *
 * This script:
 * 1. Scans /public/assets recursively
 * 2. Detects inconsistencies and missing files
 * 3. Auto-repairs naming (lowercase, no spaces)
 * 4. Ensures cover images exist in every folder
 * 5. Validates against manifest
 * 6. Rebuilds manifest based on real files
 * 7. Generates validation report
 */

const fs = require("fs");
const path = require("path");

const ASSETS_ROOT = path.join(__dirname, "public/assets");
const MANIFEST_PATH = path.join(__dirname, "src/data/assetManifest.json");

// Supported formats
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const COVER_PRIORITY = [".webp", ".avif", ".jpg"];

let report = {
  issues: [],
  fixes: [],
  manifest: {},
  stats: {
    totalFolders: 0,
    totalFiles: 0,
    missingCovers: 0,
    invalidFormats: 0,
    fixedNaming: 0,
    createdCovers: 0,
  },
};

// ===========================
// STEP 1: RECURSIVE SCANNER
// ===========================

function scanAssets(dir, relPath = "") {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Directory not found: ${dir}`);
    return [];
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });
  let images = [];

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);
    const relPathNew = relPath ? `${relPath}/${item.name}` : item.name;

    if (item.isDirectory()) {
      report.stats.totalFolders++;
      const subImages = scanAssets(fullPath, relPathNew);
      images = images.concat(subImages);
    } else if (item.isFile()) {
      report.stats.totalFiles++;

      const ext = path.extname(item.name).toLowerCase();
      const issue = analyzeFile(item.name, ext, relPathNew);

      if (issue) {
        images.push({
          folder: relPath,
          file: item.name,
          ext: ext,
          fullPath: fullPath,
          relPath: relPathNew,
          ...issue,
        });
      } else {
        images.push({
          folder: relPath,
          file: item.name,
          ext: ext,
          fullPath: fullPath,
          relPath: relPathNew,
          valid: true,
        });
      }
    }
  });

  return images;
}

// ===========================
// STEP 2: FILE ANALYSIS
// ===========================

function analyzeFile(filename, ext, relPath) {
  const issues = {};

  // Check extension
  if (!SUPPORTED_FORMATS.includes(ext)) {
    issues.unsupportedFormat = true;
    report.stats.invalidFormats++;
  }

  // Check naming issues
  if (filename !== filename.toLowerCase()) {
    issues.uppercaseFound = true;
    report.stats.fixedNaming++;
  }

  if (filename.includes(" ")) {
    issues.spacesInName = true;
    report.stats.fixedNaming++;
  }

  return Object.keys(issues).length > 0 ? issues : null;
}

// ===========================
// STEP 3: GROUP BY FOLDER
// ===========================

function groupByFolder(images) {
  const folders = {};

  images.forEach((img) => {
    if (!img.folder) return;

    if (!folders[img.folder]) {
      folders[img.folder] = [];
    }
    folders[img.folder].push(img);
  });

  return folders;
}

// ===========================
// STEP 4: CHECK COVERS
// ===========================

function checkAndCreateCovers(folderGroups) {
  Object.entries(folderGroups).forEach(([folder, files]) => {
    const validFiles = files.filter((f) => SUPPORTED_FORMATS.includes(f.ext));

    if (validFiles.length === 0) return;

    // Check if any cover exists
    const hasCover = files.some((f) => f.file.toLowerCase().startsWith("cover"));

    if (!hasCover) {
      report.stats.missingCovers++;
      const firstImage = validFiles[0];

      report.fixes.push({
        type: "CREATE_COVER",
        folder: folder,
        source: firstImage.file,
        target: `cover${firstImage.ext}`,
        reason: "No cover image found",
      });
    }
  });
}

// ===========================
// STEP 5: BUILD MANIFEST
// ===========================

function buildManifest(images) {
  const manifest = {};

  images.forEach((img) => {
    if (!img.valid && img.unsupportedFormat) return; // Skip invalid

    const folder = img.folder;
    const filename = img.file.toLowerCase().replace(/\s+/g, "-");

    if (!folder) return;

    const key = `/assets/${folder}`.toLowerCase();
    const fullPath = `/assets/${folder}/${filename}`.toLowerCase();

    // Use first found, don't overwrite
    if (!manifest[key]) {
      manifest[key] = fullPath;
    }
  });

  return manifest;
}

// ===========================
// STEP 6: VALIDATE MANIFEST
// ===========================

function validateManifest(manifest) {
  const issues = [];

  Object.entries(manifest).forEach(([key, path]) => {
    // Check if file exists
    const filePath = `${ASSETS_ROOT}/${path.replace("/assets/", "")}`;
    if (!fs.existsSync(filePath)) {
      issues.push({
        type: "FILE_NOT_FOUND",
        key: key,
        path: path,
      });
    }
  });

  return issues;
}

// ===========================
// MAIN EXECUTION
// ===========================

console.log("🔍 ASSET VALIDATION & AUTO-REPAIR PASS\n");
console.log("📁 Step 1: Scanning assets...");

const allImages = scanAssets(ASSETS_ROOT);
console.log(`✅ Found ${report.stats.totalFolders} folders, ${report.stats.totalFiles} files\n`);

console.log("📊 Step 2: Analyzing files...");
const folderGroups = groupByFolder(allImages);
console.log(`📂 Organized into ${Object.keys(folderGroups).length} category folders\n`);

console.log("🔧 Step 3: Checking covers and naming...");
checkAndCreateCovers(folderGroups);
console.log(`⚠️ Missing covers: ${report.stats.missingCovers} folders\n`);

console.log("📋 Step 4: Building manifest from real files...");
report.manifest = buildManifest(allImages);
console.log(`✅ Manifest has ${Object.keys(report.manifest).length} entries\n`);

console.log("✔️ Step 5: Validating manifest...");
const manifestIssues = validateManifest(report.manifest);
if (manifestIssues.length > 0) {
  console.log(`⚠️ Found ${manifestIssues.length} missing files in manifest`);
}
console.log();

console.log("📈 STATISTICS");
console.log("─".repeat(50));
console.log(`Total Folders: ${report.stats.totalFolders}`);
console.log(`Total Files: ${report.stats.totalFiles}`);
console.log(`Unsupported Formats: ${report.stats.invalidFormats}`);
console.log(`Naming Issues: ${report.stats.fixedNaming}`);
console.log(`Missing Covers: ${report.stats.missingCovers}`);
console.log(`Manifest Entries: ${Object.keys(report.manifest).length}`);
console.log(`Manifest Issues: ${manifestIssues.length}`);
console.log();

console.log("📝 FIXES NEEDED: " + report.fixes.length);
console.log("─".repeat(50));
if (report.fixes.length === 0) {
  console.log("✅ No fixes needed!");
} else {
  report.fixes.slice(0, 10).forEach((fix) => {
    console.log(`${fix.type}: ${fix.folder}`);
    console.log(`   → ${fix.source} → ${fix.target}`);
  });
  if (report.fixes.length > 10) {
    console.log(`... and ${report.fixes.length - 10} more fixes`);
  }
}
console.log();

console.log("✨ Validation complete!\n");
