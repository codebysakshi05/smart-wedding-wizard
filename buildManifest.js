import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "public", "assets");
const manifestPath = path.join(__dirname, "src", "data", "assetManifest.json");

const manifest = {};

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else {
      if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
        // Convert to web path
        let webPath = fullPath.replace(path.join(__dirname, "public").replace(/\\/g, path.sep), "").replace(/\\/g, "/");
        if (!webPath.startsWith("/")) webPath = "/" + webPath;
        
        // Key is the directory path without the filename, normalized
        let key = path.dirname(webPath).replace(/\\/g, "/");
        if (!key.startsWith("/")) key = "/" + key;
        
        // If this is a cover image or the only image, map the directory directly to it
        if (entry.name.startsWith("cover") || entry.name.startsWith("default")) {
          manifest[key] = webPath;
        } else {
          // Also store other images under their own key or a gallery array
          // But for strictAssetResolver, it just wants a 1:1 mapping.
          // Let's map it under its full key without extension
          const noExt = webPath.replace(/\.[^/.]+$/, "");
          manifest[noExt] = webPath;
        }
      }
    }
  }
}

console.log("Scanning assets...");
scanDir(publicDir);

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log("Manifest written to", manifestPath);
