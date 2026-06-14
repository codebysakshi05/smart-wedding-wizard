const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Try to use sharp, if not, try to install it locally first
let sharp;
try {
  sharp = require("sharp");
} catch (e) {
  console.log("sharp not found, installing locally...");
  execSync("npm install --no-save sharp", { stdio: "inherit" });
  sharp = require("sharp");
}

const assetsDir = path.join(__dirname, "public", "assets");
const MAX_WIDTH = 1920;

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    // Cleanup orphaned .tmp files from previous crashed runs
    if (file.endsWith(".tmp") || file.endsWith(".tmp2")) {
      try {
        fs.unlinkSync(fullPath);
      } catch (e) {}
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        await processImage(fullPath, ext);
      }
    }
  }
}

async function processImage(filePath, ext) {
  const parsedPath = path.parse(filePath);
  const newPath = path.join(parsedPath.dir, parsedPath.name + ".webp");

  try {
    // Read to buffer first so sharp doesn't hold a lock on the file!
    const inputBuffer = fs.readFileSync(filePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    let width = metadata.width;
    let height = metadata.height;

    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    const tempPath = newPath + ".tmp";

    await image.resize(width, height).webp({ quality: 80, effort: 6 }).toFile(tempPath);

    const stat = fs.statSync(tempPath);
    if (stat.size > 700 * 1024) {
      console.log(`[WARN] ${tempPath} is still > 700KB. Compressing further...`);
      await sharp(tempPath)
        .webp({ quality: 60, effort: 6 })
        .toFile(tempPath + "2");
      fs.unlinkSync(tempPath);
      fs.renameSync(tempPath + "2", tempPath);
    }

    if (filePath !== newPath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Attempt rename, with simple retry if still locked by something else
    let retries = 3;
    while (retries > 0) {
      try {
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(tempPath, newPath);
        break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    console.log(`✅ Optimized: ${newPath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log("Starting image optimization...");
processDirectory(assetsDir)
  .then(() => console.log("🎉 Optimization complete!"))
  .catch((err) => console.error("Error during optimization:", err));
