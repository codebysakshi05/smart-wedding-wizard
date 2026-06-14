const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "../public/wedding-data");
const outputFile = path.join(__dirname, "../src/data/imageRegistry.ts");

function getRelativeUrl(filePath) {
  const relativePath = path.relative(path.join(__dirname, ".."), filePath);
  // Keep `/wedding-data/...` as the public path, since Vite public files are served from root
  return "/" + path.relative(path.join(__dirname, "../public"), filePath).replace(/\\/g, "/");
}

function scanSubdirs(parentDir) {
  const fullParentPath = path.join(baseDir, parentDir);
  if (!fs.existsSync(fullParentPath)) return {};

  const entries = fs.readdirSync(fullParentPath, { withFileTypes: true });
  const result = {};

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDirName = entry.name.toLowerCase(); // keep kebab-case or whatever it is
      const subDirPath = path.join(fullParentPath, entry.name);
      const files = fs.readdirSync(subDirPath);

      const images = files
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map((f) => f.toLowerCase());

      const cover = images.find((img) => img.startsWith("cover")) || images[0];
      const gallery = images.filter((img) => !img.startsWith("cover"));

      result[subDirName] = {
        cover: cover ? getRelativeUrl(path.join(subDirPath, cover)) : "/wedding-data/fallback.jpg",
        gallery: gallery.map((g) => getRelativeUrl(path.join(subDirPath, g))),
      };
    }
  }
  return result;
}

const venues = scanSubdirs("venues");
const services = scanSubdirs("services");
const outfits = scanSubdirs("outfits");
const decor = scanSubdirs("decor");
const photography = scanSubdirs("photography");

const registryContent = `// Centralized Static Image Registry
// Generated automatically to prevent broken dynamic paths and casing errors.

export const VENUES_REGISTRY: Record<string, { cover: string; gallery: string[] }> = ${JSON.stringify(venues, null, 2)};

export const SERVICES_REGISTRY: Record<string, { cover: string; gallery: string[] }> = ${JSON.stringify(services, null, 2)};

export const OUTFITS_REGISTRY: Record<string, { cover: string; gallery: string[] }> = ${JSON.stringify(outfits, null, 2)};

export const DECOR_REGISTRY: Record<string, { cover: string; gallery: string[] }> = ${JSON.stringify(decor, null, 2)};

export const PHOTOGRAPHY_REGISTRY: Record<string, { cover: string; gallery: string[] }> = ${JSON.stringify(photography, null, 2)};

export const FALLBACK_IMAGE = "/wedding-data/fallback.jpg";
`;

fs.writeFileSync(outputFile, registryContent, "utf8");
console.log("Registry generated successfully at src/data/imageRegistry.ts");
