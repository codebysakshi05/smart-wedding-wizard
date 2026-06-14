const fs = require("fs");
const path = require("path");

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    let newName = item;
    if (stat.isFile()) {
      const ext = path.extname(item);
      const name = path.basename(item, ext);
      newName = toKebabCase(name) + ext.toLowerCase();
    } else {
      newName = toKebabCase(item);
    }

    const newPath = path.join(dir, newName);

    let targetPath = fullPath;
    if (fullPath !== newPath) {
      fs.renameSync(fullPath, newPath);
      console.log(`Renamed: ${item} -> ${newName}`);
      targetPath = newPath;
    }

    if (stat.isDirectory()) {
      walkDir(targetPath);
    }
  }
}

const assetsDir = path.join(__dirname, "public", "wedding-data", "assets");
walkDir(assetsDir);
console.log("Finished renaming to kebab-case.");
