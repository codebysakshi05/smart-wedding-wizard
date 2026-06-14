const fs = require("fs");
const path = require("path");

const MANIFEST_DIR = path.join(__dirname, "../public/wedding-data/manifests");
const OLD_DATA_DIR = path.join(__dirname, "../public/wedding-data/data");

// Ensure manifests dir exists
fs.mkdirSync(MANIFEST_DIR, { recursive: true });

// We need 5 manifests: venues.json, services.json, outfits.json, decor.json, photography.json

// 1. venues.json
const venues = [
  {
    id: "v1",
    category: "palace",
    state: "rajasthan",
    budget: "premium",
    religion: "hindu",
    image: "/wedding-data/venues/rajasthan/cover.jpg",
  },
  {
    id: "v2",
    category: "resort",
    state: "goa",
    budget: "premium",
    religion: "christian",
    image: "/wedding-data/venues/goa/cover.jpg",
  },
  {
    id: "v3",
    category: "palace",
    state: "delhi",
    budget: "premium",
    religion: "sikh",
    image: "/wedding-data/venues/delhi/cover.jpg",
  },
  {
    id: "v4",
    category: "resort",
    state: "kerala",
    budget: "mid",
    religion: "hindu",
    image: "/wedding-data/venues/kerala/cover.jpg",
  },
  {
    id: "v5",
    category: "palace",
    state: "tamil-nadu",
    budget: "premium",
    religion: "hindu",
    image: "/wedding-data/venues/tamil-nadu/cover.jpg",
  },
  {
    id: "v6",
    category: "palace",
    state: "telangana",
    budget: "premium",
    religion: "muslim",
    image: "/wedding-data/venues/telangana/cover.jpg",
  },
];

fs.writeFileSync(path.join(MANIFEST_DIR, "venues.json"), JSON.stringify(venues, null, 2));

// 2. services.json
const services = [
  {
    id: "s1",
    category: "decorators",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/services/decorators/cover.jpg",
  },
  {
    id: "s2",
    category: "makeup",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/services/makeup/cover.jpg",
  },
  {
    id: "s3",
    category: "caterers",
    state: "all",
    budget: "mid",
    religion: "all",
    image: "/wedding-data/services/caterers/cover.jpg",
  },
  {
    id: "s4",
    category: "planners",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/services/planners/cover.jpg",
  },
  {
    id: "s5",
    category: "entertainment",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/services/entertainment/cover.jpg",
  },
];

fs.writeFileSync(path.join(MANIFEST_DIR, "services.json"), JSON.stringify(services, null, 2));

// 3. outfits.json
const outfits = [
  {
    id: "o1",
    category: "lehenga",
    state: "all",
    budget: "premium",
    religion: "hindu",
    image: "/wedding-data/outfits/lehenga/cover.jpg",
  },
  {
    id: "o2",
    category: "saree",
    state: "all",
    budget: "premium",
    religion: "hindu",
    image: "/wedding-data/outfits/saree/cover.jpg",
  },
  {
    id: "o3",
    category: "sharara",
    state: "all",
    budget: "premium",
    religion: "muslim",
    image: "/wedding-data/outfits/sharara/cover.jpg",
  },
  {
    id: "o4",
    category: "bridal-gown",
    state: "all",
    budget: "premium",
    religion: "christian",
    image: "/wedding-data/outfits/bridal-gown/cover.jpg",
  },
  {
    id: "o5",
    category: "sherwani",
    state: "all",
    budget: "premium",
    religion: "hindu",
    image: "/wedding-data/outfits/sherwani/cover.jpg",
  },
];

fs.writeFileSync(path.join(MANIFEST_DIR, "outfits.json"), JSON.stringify(outfits, null, 2));

// 4. decor.json
const decor = [
  {
    id: "d1",
    category: "royal",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/decor/royal/cover.jpg",
  },
  {
    id: "d2",
    category: "floral",
    state: "all",
    budget: "mid",
    religion: "all",
    image: "/wedding-data/decor/floral/cover.jpg",
  },
  {
    id: "d3",
    category: "minimal",
    state: "all",
    budget: "budget",
    religion: "all",
    image: "/wedding-data/decor/minimal/cover.jpg",
  },
  {
    id: "d4",
    category: "luxury",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/decor/luxury/cover.jpg",
  },
  {
    id: "d5",
    category: "traditional",
    state: "all",
    budget: "mid",
    religion: "all",
    image: "/wedding-data/decor/traditional/cover.jpg",
  },
];

fs.writeFileSync(path.join(MANIFEST_DIR, "decor.json"), JSON.stringify(decor, null, 2));

// 5. photography.json
const photography = [
  {
    id: "p1",
    category: "cinematic",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/photography/cinematic/cover.jpg",
  },
  {
    id: "p2",
    category: "candid",
    state: "all",
    budget: "mid",
    religion: "all",
    image: "/wedding-data/photography/candid/cover.jpg",
  },
  {
    id: "p3",
    category: "traditional",
    state: "all",
    budget: "budget",
    religion: "all",
    image: "/wedding-data/photography/traditional/cover.jpg",
  },
  {
    id: "p4",
    category: "drone",
    state: "all",
    budget: "premium",
    religion: "all",
    image: "/wedding-data/photography/drone/cover.jpg",
  },
];

fs.writeFileSync(path.join(MANIFEST_DIR, "photography.json"), JSON.stringify(photography, null, 2));

console.log("Manifests successfully created.");
