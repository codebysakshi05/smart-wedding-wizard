/**
 * fix_manifests.cjs
 * Rewrites all image paths in manifests to use the correct registry paths.
 * Fixes: /wedding-data/assets/... → /wedding-data/...
 * Fixes: gallery1.jpg → 1.jpg, gallery2.jpg → 2.jpg
 */
const fs = require("fs");
const path = require("path");

const manifestsDir = path.join(__dirname, "../public/wedding-data/manifests");

function fixImagePath(src, stateOrCategory) {
  if (!src || typeof src !== "string") return null;

  // Already correct path
  if (src.startsWith("/wedding-data/") && !src.includes("/assets/")) return src;

  // Fix old assets path
  let fixed = src
    .replace("/wedding-data/assets/", "/wedding-data/")
    .replace("gallery1.jpg", "1.jpg")
    .replace("gallery2.jpg", "2.jpg")
    .replace("gallery3.jpg", "3.jpg");

  return fixed;
}

function fixEntry(entry) {
  // Fix localImagePath
  if (entry.localImagePath) {
    entry.localImagePath =
      fixImagePath(entry.localImagePath) ?? entry.image ?? "/wedding-data/fallback.jpg";
  }
  // image field — ensure it's the correct path
  if (entry.image) {
    entry.image = fixImagePath(entry.image) ?? "/wedding-data/fallback.jpg";
  }
  // coverImage
  if (entry.coverImage) {
    entry.coverImage = fixImagePath(entry.coverImage) ?? "/wedding-data/fallback.jpg";
  }
  // gallery array
  if (Array.isArray(entry.gallery)) {
    entry.gallery = entry.gallery.map((g) => fixImagePath(g)).filter(Boolean);
  }
  // images array (services)
  if (Array.isArray(entry.images)) {
    entry.images = entry.images.map((g) => fixImagePath(g)).filter(Boolean);
  }
  return entry;
}

const files = fs.readdirSync(manifestsDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const filePath = path.join(manifestsDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse ${file}:`, e.message);
    continue;
  }

  if (Array.isArray(data)) {
    data = data.map(fixEntry);
  } else if (typeof data === "object") {
    data = fixEntry(data);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`✓ Fixed: ${file}`);
}

console.log("\nAll manifests fixed successfully!");
