const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "public");
const assetsDir = path.join(publicDir, "wedding-data", "assets");
const registryFile = path.join(publicDir, "wedding-data", "assets-registry.json");
const srcRegistryFile = path.join(__dirname, "src", "wedding-data", "assets-registry.json");

const registry = {};

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        // Compute relative path from public folder
        const relPath = "/" + path.relative(publicDir, fullPath).replace(/\\/g, "/");
        // Compute parent folder path from public folder
        const parentPath = "/" + path.relative(publicDir, dir).replace(/\\/g, "/");

        if (!registry[parentPath]) {
          registry[parentPath] = [];
        }
        registry[parentPath].push(relPath);
      }
    }
  }
}

try {
  if (fs.existsSync(assetsDir)) {
    scanDirectory(assetsDir);
    fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2), "utf8");
    if (fs.existsSync(path.dirname(srcRegistryFile))) {
      fs.writeFileSync(srcRegistryFile, JSON.stringify(registry, null, 2), "utf8");
    }
    console.log(
      "Successfully wrote assets registry containing",
      Object.keys(registry).length,
      "folders.",
    );
  } else {
    console.error("Assets directory not found at:", assetsDir);
  }
} catch (err) {
  console.error("Failed to build assets registry:", err);
}
