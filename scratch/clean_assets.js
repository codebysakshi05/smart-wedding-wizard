const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "../public/wedding-data");
const OLD_ASSETS = path.join(BASE, "assets");

const TARGET_DIRS = [
  "manifests",
  "venues/rajasthan",
  "venues/goa",
  "venues/kerala",
  "venues/karnataka",
  "venues/tamil-nadu",
  "venues/telangana",
  "venues/delhi",
  "venues/maharashtra",
  "venues/punjab",
  "venues/west-bengal",
  "services/photographers",
  "services/decorators",
  "services/makeup",
  "services/caterers",
  "services/planners",
  "services/entertainment",
  "outfits/lehenga",
  "outfits/saree",
  "outfits/sharara",
  "outfits/bridal-gown",
  "outfits/sherwani",
  "outfits/tuxedo",
  "outfits/kurta",
  "outfits/indo-western",
  "decor/royal",
  "decor/floral",
  "decor/minimal",
  "decor/luxury",
  "decor/traditional",
  "photography/cinematic",
  "photography/candid",
  "photography/traditional",
  "photography/drone",
];

// 1. Create new structure
TARGET_DIRS.forEach((dir) => {
  fs.mkdirSync(path.join(BASE, dir), { recursive: true });
});

console.log("New directories created.");

// 2. Helper to copy an image if exists
function copyImage(srcPath, destPath) {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    return true;
  }
  return false;
}

// Map old venues to new
const states = [
  "rajasthan",
  "goa",
  "kerala",
  "karnataka",
  "tamil-nadu",
  "telangana",
  "delhi",
  "maharashtra",
  "punjab",
  "west-bengal",
];
states.forEach((state) => {
  copyImage(
    path.join(OLD_ASSETS, "venues", state, "cover.jpg"),
    path.join(BASE, "venues", state, "cover.jpg"),
  );
  copyImage(
    path.join(OLD_ASSETS, "venues", state, "gallery1.jpg"),
    path.join(BASE, "venues", state, "1.jpg"),
  );
  copyImage(
    path.join(OLD_ASSETS, "venues", state, "gallery2.jpg"),
    path.join(BASE, "venues", state, "2.jpg"),
  );
});

// Map services
// Services are messy in old, they are in services/decorators/decor/luxury etc. Let's just pull whatever we can find and put them cleanly.
function findImage(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith(".jpg") || f.endsWith(".png")) {
      return path.join(dir, f);
    }
  }
  return null;
}

const serviceMap = {
  decorators: path.join(OLD_ASSETS, "services/decorators/decor/luxury"),
  makeup: path.join(OLD_ASSETS, "services/makeup/makeup/bridal"),
  caterers: path.join(OLD_ASSETS, "services/caterers/food/buffet"),
  planners: path.join(OLD_ASSETS, "services/planners/ideas/lighting"),
  entertainment: path.join(OLD_ASSETS, "services/entertainment/dj"),
};

for (const [key, oldDir] of Object.entries(serviceMap)) {
  const img = findImage(oldDir);
  if (img) copyImage(img, path.join(BASE, "services", key, "cover.jpg"));
}

// Outfits
const outfitTypes = [
  "lehenga",
  "saree",
  "sharara",
  "bridal-gown",
  "sherwani",
  "tuxedo",
  "kurta",
  "indo-western",
];
outfitTypes.forEach((t) => {
  // some old outfits were in assets/outfits/lehenga/lehenga1.jpg
  const img = findImage(path.join(OLD_ASSETS, "outfits", t));
  if (img) copyImage(img, path.join(BASE, "outfits", t, "cover.jpg"));
});

// Decor
const decorTypes = ["royal", "floral", "minimal", "luxury", "traditional"];
decorTypes.forEach((t) => {
  const img = findImage(path.join(OLD_ASSETS, "decor", t));
  if (img) copyImage(img, path.join(BASE, "decor", t, "cover.jpg"));
});

// Photography - try to find some fallback images for photography since they might be in styles or elsewhere
["cinematic", "candid", "traditional", "drone"].forEach((t) => {
  const img = findImage(path.join(OLD_ASSETS, "styles", "traditional")); // just grab any image to use as cover
  if (img) copyImage(img, path.join(BASE, "photography", t, "cover.jpg"));
});

console.log("Assets copied to new structure.");
