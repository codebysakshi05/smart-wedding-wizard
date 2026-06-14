/**
 * weddingPlannerEngine.js
 *
 * Production-level Smart Wedding Wizard Planning Engine.
 * Generates personalized, religion-aware, state-specific, budget-accurate
 * wedding plans. No external APIs — 100% local asset mapping.
 *
 * Supports: Hindu | Muslim | Christian | Sikh | South Indian
 */

"use strict";

// ─── Asset path builder ───────────────────────────────────────────────────────
const A = (path) => `/assets/${path}`;

// ─── Budget tier resolver ─────────────────────────────────────────────────────
const getTier = (budget) => {
  if (budget >= 2500000) return "premium"; // 25L+
  if (budget >= 800000) return "mid"; // 8L–25L
  return "budget"; // <8L
};

// ─── State slug normalizer ────────────────────────────────────────────────────
const STATE_SLUGS = {
  rajasthan: "rajasthan",
  jaipur: "rajasthan",
  jodhpur: "rajasthan",
  udaipur: "rajasthan",
  jaisalmer: "rajasthan",
  kerala: "kerala",
  kochi: "kerala",
  trivandrum: "kerala",
  munnar: "kerala",
  alleppey: "kerala",
  goa: "goa",
  maharashtra: "maharashtra",
  mumbai: "maharashtra",
  pune: "maharashtra",
  nashik: "maharashtra",
  aurangabad: "maharashtra",
  karnataka: "karnataka",
  bangalore: "karnataka",
  bengaluru: "karnataka",
  mysore: "karnataka",
  coorg: "karnataka",
  punjab: "punjab",
  amritsar: "punjab",
  chandigarh: "punjab",
  ludhiana: "punjab",
  "tamil-nadu": "tamil-nadu",
  tamilnadu: "tamil-nadu",
  chennai: "tamil-nadu",
  madurai: "tamil-nadu",
  ooty: "tamil-nadu",
  coimbatore: "tamil-nadu",
  delhi: "delhi",
  "new delhi": "delhi",
};

const resolveState = (input = "") => {
  const s = input.toLowerCase().trim();
  return STATE_SLUGS[s] || s.replace(/\s+/g, "-");
};

// ─── VENUE DATABASE — real named venues mapped to local assets ────────────────
const VENUE_DB = {
  rajasthan: {
    premium: [
      {
        name: "Mehrangarh Fort Palace",
        slug: "mehrangarh-fort-palace",
        capacity: "500–2000",
        style: "Royal Heritage",
        vibe: "Majestic fortress with panoramic desert views and royal courtyards",
        rating: 4.9,
        priceRange: "₹25L–₹80L",
        features: ["Elephant Entry", "Royal Tent Setup", "Heritage Lighting", "Sunset Terrace"],
      },
      {
        name: "Rambagh Palace",
        slug: "rambagh-palace",
        capacity: "300–1500",
        style: "Mughal Palace",
        vibe: "Once home to the Maharaja of Jaipur — an unparalleled regal experience",
        rating: 5.0,
        priceRange: "₹50L–₹2Cr",
        features: ["Royal Suite", "Heritage Pool", "Vintage Carriages", "Private Gardens"],
      },
      {
        name: "Udai Palace Resort",
        slug: "udai-palace-resort",
        capacity: "200–800",
        style: "Lakeside Palace",
        vibe: "Glittering lake views with whitewashed Rajput architecture",
        rating: 4.8,
        priceRange: "₹20L–₹60L",
        features: ["Lake View Mandap", "Rooftop Reception", "Floating Stage", "Palace Corridor"],
      },
    ],
    mid: [
      {
        name: "Amber Palace Banquet",
        slug: "amber-palace-banquet",
        capacity: "200–600",
        style: "Heritage Banquet",
        vibe: "Surrounded by Aravalli hills with authentic Rajasthani ambience",
        rating: 4.5,
        priceRange: "₹8L–₹20L",
        features: ["Open Courtyard", "Folk Entertainment", "Camel Rides", "Traditional Decor"],
      },
      {
        name: "Desert Crown Resort",
        slug: "desert-crown-resort",
        capacity: "150–500",
        style: "Desert Resort",
        vibe: "Under the vast Thar sky — glamping-style wedding experience",
        rating: 4.4,
        priceRange: "₹6L–₹15L",
        features: [
          "Sand Dune Setup",
          "Bonfire Evenings",
          "Cultural Performances",
          "Star-lit Canopy",
        ],
      },
      {
        name: "Haveli Banquet Garden",
        slug: "haveli-banquet-garden",
        capacity: "100–400",
        style: "Garden Haveli",
        vibe: "Charming haveli with lush kund gardens and traditional jharokhas",
        rating: 4.3,
        priceRange: "₹5L–₹12L",
        features: ["Open Garden", "Heritage Jharokha", "Folk Music", "Haveli Lighting"],
      },
    ],
    budget: [
      {
        name: "City Center Hall",
        slug: "city-center-hall",
        capacity: "100–350",
        style: "Banquet Hall",
        vibe: "Modern, well-lit hall perfect for intimate city weddings",
        rating: 3.9,
        priceRange: "₹1.5L–₹5L",
        features: ["AC Hall", "Basic Decor", "In-house Catering", "Parking"],
      },
      {
        name: "Riverside Camp Ground",
        slug: "riverside-camp-ground",
        capacity: "100–400",
        style: "Outdoor Ground",
        vibe: "Open riverside grounds ideal for budget-conscious large gatherings",
        rating: 3.7,
        priceRange: "₹80K–₹3L",
        features: ["Open Grounds", "Tent Setup", "Flexible Layout", "Natural Setting"],
      },
      {
        name: "Sakura Garden Hall",
        slug: "sakura-garden-hall",
        capacity: "80–250",
        style: "Garden Hall",
        vibe: "Intimate garden hall with simple Rajasthani charm",
        rating: 3.8,
        priceRange: "₹1L–₹4L",
        features: ["Garden Space", "Basic Lighting", "Outdoor Dining", "Parking"],
      },
    ],
  },
  kerala: {
    premium: [
      {
        name: "Backwater Palace Resort",
        slug: "backwater-palace-resort",
        capacity: "200–700",
        style: "Backwater Resort",
        vibe: "Floating mandap on Kerala backwaters with houseboats and coconut palms",
        rating: 4.9,
        priceRange: "₹20L–₹55L",
        features: [
          "Houseboat Ceremony",
          "Backwater Views",
          "Traditional Sadhya",
          "Kathakali Performance",
        ],
      },
      {
        name: "Spice Garden Palace",
        slug: "spice-garden-palace",
        capacity: "150–500",
        style: "Plantation Estate",
        vibe: "Lush cardamom and pepper gardens create a fragrant, tropical paradise",
        rating: 4.7,
        priceRange: "₹15L–₹40L",
        features: ["Spice Gardens", "Organic Décor", "Elephant Blessing", "Village Ceremony"],
      },
      {
        name: "Tea Garden Grand Estate",
        slug: "tea-garden-grand-estate",
        capacity: "200–600",
        style: "Hill Estate",
        vibe: "Misty Munnar hills with sweeping tea estate views",
        rating: 4.8,
        priceRange: "₹18L–₹50L",
        features: ["Tea Plantation Walk", "Mist Ceremony", "Traditional Music", "Estate Dining"],
      },
    ],
    mid: [
      {
        name: "Coconut Grove Venue",
        slug: "coconut-grove-venue",
        capacity: "150–450",
        style: "Tropical Garden",
        vibe: "Authentic Kerala garden under coconut canopy",
        rating: 4.4,
        priceRange: "₹6L–₹16L",
        features: ["Coconut Canopy", "Banana Leaf Dining", "Folk Dances", "Temple Bells"],
      },
      {
        name: "Lagoon View Garden Resort",
        slug: "lagoon-view-garden-resort",
        capacity: "100–350",
        style: "Lagoon Resort",
        vibe: "Serene lagoon views with Kerala tiled rooflines and ponds",
        rating: 4.3,
        priceRange: "₹5L–₹13L",
        features: ["Lagoon View", "Open Lawn", "South Indian Cuisine", "Traditional Rituals"],
      },
      {
        name: "Hill Station Banquet Hall",
        slug: "hill-station-banquet-hall",
        capacity: "100–300",
        style: "Hill Banquet",
        vibe: "Cool hill air with panoramic valley views",
        rating: 4.2,
        priceRange: "₹4L–₹10L",
        features: ["Valley Views", "Cool Climate", "Garden Access", "Cozy Interiors"],
      },
    ],
    budget: [
      {
        name: "Village Community Hall",
        slug: "village-community-hall",
        capacity: "80–250",
        style: "Community Hall",
        vibe: "Traditional Kerala community hall with authentic customs",
        rating: 3.8,
        priceRange: "₹80K–₹3.5L",
        features: ["Community Setting", "Banana Leaf Feast", "Simple Décor", "Local Catering"],
      },
      {
        name: "Paddy Field Open Ground",
        slug: "paddy-field-open-ground",
        capacity: "100–400",
        style: "Open Ground",
        vibe: "Vast paddy fields transformed for a traditional outdoor wedding",
        rating: 3.7,
        priceRange: "₹60K–₹2.5L",
        features: ["Open Air", "Rural Charm", "Natural Green", "Flexible Tent"],
      },
      {
        name: "Local Mosque Courtyard",
        slug: "local-mosque-courtyard",
        capacity: "50–200",
        style: "Courtyard",
        vibe: "Intimate courtyard setting for Muslim nikah ceremonies",
        rating: 4.0,
        priceRange: "₹50K–₹2L",
        features: ["Sacred Space", "Courtyard", "Nikah Setup", "Simple Elegance"],
      },
    ],
  },
  goa: {
    premium: [
      {
        name: "Goa Beach Palace Resort",
        slug: "premium",
        capacity: "200–800",
        style: "Beachfront Palace",
        vibe: "Golden sand beach ceremonies under swaying palms at sunset",
        rating: 4.9,
        priceRange: "₹25L–₹70L",
        features: ["Beachfront Ceremony", "Sunset Mandap", "Pool Party", "DJ Night"],
      },
    ],
    mid: [
      {
        name: "Goa Heritage Garden",
        slug: "mid",
        capacity: "100–350",
        style: "Portuguese Garden",
        vibe: "Colonial Portuguese architecture with tropical blooms",
        rating: 4.5,
        priceRange: "₹8L–₹20L",
        features: ["Colonial Charm", "Tropical Flowers", "Garden Dining", "Live Band"],
      },
    ],
    budget: [
      {
        name: "Goa Village Ground",
        slug: "budget",
        capacity: "80–300",
        style: "Village Lawn",
        vibe: "Authentic Goan spirit with simple natural beauty",
        rating: 3.9,
        priceRange: "₹1.5L–₹5L",
        features: ["Open Lawn", "Affordable Setup", "Local Cuisine", "Natural Ambience"],
      },
    ],
  },
  maharashtra: {
    premium: [
      {
        name: "Mumbai Grand Palace",
        slug: "mumbai-grand-palace",
        capacity: "300–1500",
        style: "Luxury Palace",
        vibe: "Opulent ballroom with Art Deco heritage and sea-facing views",
        rating: 4.8,
        priceRange: "₹30L–₹90L",
        features: ["Ballroom", "Sea View", "Luxury Suites", "Celebrity Chef"],
      },
      {
        name: "Nashik Vineyard Resort",
        slug: "nashik-vineyard-resort",
        capacity: "150–500",
        style: "Vineyard Estate",
        vibe: "Rolling wine country landscape with grape arbour ceremonies",
        rating: 4.7,
        priceRange: "₹18L–₹50L",
        features: ["Vineyard Views", "Wine Tasting", "Outdoor Lawn", "Boutique Rooms"],
      },
      {
        name: "Pune Heritage Estate",
        slug: "pune-heritage-estate",
        capacity: "200–700",
        style: "Heritage Estate",
        vibe: "Maratha heritage estate with grand darbars and historic grandeur",
        rating: 4.6,
        priceRange: "₹20L–₹55L",
        features: ["Heritage Darbar", "Palace Gardens", "Maratha Décor", "Horse Entry"],
      },
    ],
    mid: [
      {
        name: "Lonavala Hill Resort",
        slug: "lonavala-hill-resort",
        capacity: "150–400",
        style: "Hill Resort",
        vibe: "Lush Sahyadri hills wrapped in monsoon mist and greenery",
        rating: 4.4,
        priceRange: "₹7L–₹18L",
        features: ["Hill Views", "Valley Gardens", "Waterfall Nearby", "Monsoon Magic"],
      },
      {
        name: "Mumbai Garden Banquet",
        slug: "mumbai-garden-banquet",
        capacity: "200–600",
        style: "City Garden",
        vibe: "Expansive garden venue in the heart of Mumbai",
        rating: 4.3,
        priceRange: "₹6L–₹15L",
        features: ["Central Location", "Large Lawns", "In-house Catering", "Air-conditioned Hall"],
      },
      {
        name: "Aurangabad Heritage Banquet",
        slug: "aurangabad-heritage-banquet",
        capacity: "100–350",
        style: "Heritage Hall",
        vibe: "Near Ajanta-Ellora heritage belt with ancient inspired interiors",
        rating: 4.3,
        priceRange: "₹5L–₹12L",
        features: ["Heritage Décor", "Outdoor Garden", "Cultural Programs", "Local Cuisine"],
      },
    ],
    budget: [
      {
        name: "Local Community Hall",
        slug: "local-community-hall",
        capacity: "80–300",
        style: "Community Hall",
        vibe: "Simple, accessible hall for Maharashtrian family weddings",
        rating: 3.8,
        priceRange: "₹1L–₹4L",
        features: ["AC Hall", "Basic Setup", "Nearby Catering", "Parking"],
      },
      {
        name: "Open Maidan Ground",
        slug: "open-maidan-ground",
        capacity: "200–800",
        style: "Open Ground",
        vibe: "Large open ground ideal for massive budget gatherings",
        rating: 3.6,
        priceRange: "₹60K–₹2.5L",
        features: ["Large Capacity", "Tent Setup", "Flexible Layout", "Open Air"],
      },
    ],
  },
  karnataka: {
    premium: [
      {
        name: "Bangalore Palace Grounds",
        slug: "bangalore-palace-grounds",
        capacity: "500–3000",
        style: "Royal Grounds",
        vibe: "Iconic Tudor-style palace surrounded by century-old trees",
        rating: 4.8,
        priceRange: "₹25L–₹80L",
        features: ["Heritage Grounds", "Vintage Architecture", "Floodlit Lawns", "Grand Entry"],
      },
      {
        name: "Mysore Royal Estate",
        slug: "mysore-royal-estate",
        capacity: "200–700",
        style: "Mysore Heritage",
        vibe: "In the shadow of the glittering Mysore Palace — pure regality",
        rating: 4.9,
        priceRange: "₹20L–₹60L",
        features: ["Palace Proximity", "Jasmine-scented Gardens", "Royal Cuisine", "Silk Canopy"],
      },
      {
        name: "Coorg Hill Station Resort",
        slug: "coorg-hill-station-resort",
        capacity: "100–400",
        style: "Hill Estate",
        vibe: "Coffee estate ceremonies in the Scotland of India",
        rating: 4.7,
        priceRange: "₹15L–₹45L",
        features: ["Coffee Plantations", "Mist Ceremonies", "Waterfalls", "Tribal Traditions"],
      },
    ],
    mid: [
      {
        name: "Garden City Resort",
        slug: "garden-city-resort",
        capacity: "150–500",
        style: "Garden Resort",
        vibe: "Bangalore's garden city charm — blooming and vibrant",
        rating: 4.4,
        priceRange: "₹7L–₹18L",
        features: ["Rose Gardens", "Outdoor Lawn", "South Indian Cuisine", "Band Baaja"],
      },
      {
        name: "Waterfall Banquet Hall",
        slug: "waterfall-banquet-hall",
        capacity: "100–350",
        style: "Nature Venue",
        vibe: "Near Western Ghats waterfall — dramatic natural backdrop",
        rating: 4.3,
        priceRange: "₹5L–₹12L",
        features: ["Waterfall View", "Forest Trails", "Natural Décor", "Cool Climate"],
      },
      {
        name: "Plantation Bungalow Venue",
        slug: "plantation-bungalow-venue",
        capacity: "80–250",
        style: "Colonial Bungalow",
        vibe: "British-era coffee estate bungalow with old-world charm",
        rating: 4.2,
        priceRange: "₹4L–₹10L",
        features: ["Bungalow Setting", "Estate Garden", "Boutique Feel", "Intimate Weddings"],
      },
    ],
    budget: [
      {
        name: "Farm Field Setup",
        slug: "farm-field-setup",
        capacity: "100–500",
        style: "Open Farm",
        vibe: "Karnataka countryside farmlands for traditional celebrations",
        rating: 3.7,
        priceRange: "₹80K–₹3L",
        features: ["Open Fields", "Flexible Setup", "Rural Charm", "Local Food"],
      },
      {
        name: "School Grounds Venue",
        slug: "school-grounds-venue",
        capacity: "100–400",
        style: "Community Ground",
        vibe: "Practical open grounds for simple traditional Karnataka weddings",
        rating: 3.6,
        priceRange: "₹60K–₹2L",
        features: ["Large Ground", "Tent Setup", "Accessible", "Budget-Friendly"],
      },
    ],
  },
  punjab: {
    premium: [
      {
        name: "Amritsar Golden Palace",
        slug: "amritsar-golden-palace",
        capacity: "300–1500",
        style: "Golden Heritage",
        vibe: "Inspired by the Golden Temple — majestic Punjabi wedding grandeur",
        rating: 4.9,
        priceRange: "₹20L–₹65L",
        features: ["Golden Décor", "Dhol & Nagaras", "Flower Showers", "Kirtan Ceremony"],
      },
      {
        name: "Chandigarh Luxury Resort",
        slug: "chandigarh-luxury-resort",
        capacity: "200–800",
        style: "Modern Luxury",
        vibe: "Le Corbusier's city of beauty — sleek, modern and spectacular",
        rating: 4.7,
        priceRange: "₹18L–₹50L",
        features: ["Modern Ballroom", "Pool Reception", "Celebrity DJ", "Rooftop Lounge"],
      },
      {
        name: "Jalandhar Garden Estate",
        slug: "jailandhar-garden-estate",
        capacity: "200–700",
        style: "Garden Palace",
        vibe: "Lush garden estate with Punjabi folk art and vibrant celebrations",
        rating: 4.6,
        priceRange: "₹15L–₹45L",
        features: ["Rose Garden", "Folk Performers", "Bhangra Stage", "Grand Langar"],
      },
    ],
    mid: [
      {
        name: "Farm Resort Banquet",
        slug: "farm-resort-banquet",
        capacity: "150–600",
        style: "Farm Wedding",
        vibe: "Fields of mustard — the quintessential Punjabi baraat experience",
        rating: 4.4,
        priceRange: "₹6L–₹15L",
        features: ["Mustard Fields", "Tractor Entry", "Bhangra DJ", "Lassi Bars"],
      },
      {
        name: "Harvest Garden Venue",
        slug: "harvest-garden-venue",
        capacity: "100–400",
        style: "Garden Hall",
        vibe: "Traditional Punjabi garden with harvest season warmth",
        rating: 4.3,
        priceRange: "₹5L–₹12L",
        features: ["Garden Lawn", "Traditional Decor", "Dholki Night", "Buffet Dining"],
      },
      {
        name: "Punjabi Culture Banquet",
        slug: "punjabi-culture-banquet",
        capacity: "200–700",
        style: "Cultural Banquet",
        vibe: "Vibrant cultural hall with folk art murals and heritage décor",
        rating: 4.2,
        priceRange: "₹4L–₹10L",
        features: ["Cultural Murals", "Folk DJ", "Air-Conditioned", "Valet Parking"],
      },
    ],
    budget: [
      {
        name: "Community Hall Junction",
        slug: "community-hall-junction",
        capacity: "100–350",
        style: "Community Hall",
        vibe: "Functional community hall for traditional Punjabi gatherings",
        rating: 3.8,
        priceRange: "₹1L–₹4L",
        features: ["AC Hall", "Basic Setup", "Community Spirit", "Affordable Catering"],
      },
      {
        name: "Agricultural Field Ground",
        slug: "agricultural-field-ground",
        capacity: "200–1000",
        style: "Open Field",
        vibe: "Expansive open land for large joint family Punjabi celebrations",
        rating: 3.6,
        priceRange: "₹50K–₹2.5L",
        features: ["Large Capacity", "Open Air", "Bhangra Space", "Natural Setting"],
      },
    ],
  },
  "tamil-nadu": {
    premium: [
      {
        name: "Chennai Grand Palace",
        slug: "chennai-grand-palace",
        capacity: "300–1200",
        style: "Dravidian Palace",
        vibe: "Towering Dravidian gopurams in a palatial wedding estate",
        rating: 4.8,
        priceRange: "₹20L–₹60L",
        features: [
          "Temple Architecture",
          "Silk Kanjeevaram Trail",
          "Grand Feast",
          "Nadaswaram Performance",
        ],
      },
      {
        name: "Ooty Hill Palace Resort",
        slug: "ooty-hill-palace-resort",
        capacity: "100–400",
        style: "Colonial Hill",
        vibe: "British colonial-era hill palace with mist-wrapped Nilgiri beauty",
        rating: 4.7,
        priceRange: "₹15L–₹45L",
        features: ["Hill Station", "Colonial Architecture", "Eucalyptus Gardens", "Cozy Fireside"],
      },
      {
        name: "Temple Town Heritage Estate",
        slug: "temple-town-heritage-estate",
        capacity: "200–800",
        style: "Heritage Estate",
        vibe: "Adjacent to ancient temples — divine South Indian ambience",
        rating: 4.8,
        priceRange: "₹18L–₹55L",
        features: ["Temple Bells", "Silk Drapes", "Classical Music", "Pattusaree Styling"],
      },
    ],
    mid: [
      {
        name: "Coimbatore Garden Banquet",
        slug: "coimbatore-garden-banquet",
        capacity: "150–500",
        style: "Garden Banquet",
        vibe: "Textile city elegance with lush garden reception setting",
        rating: 4.3,
        priceRange: "₹5L–₹14L",
        features: ["Garden Lawns", "Classic Lighting", "Vegetarian Feast", "Traditional Rituals"],
      },
      {
        name: "Tirupati Riverside Venue",
        slug: "tirupati-riverside-venue",
        capacity: "100–400",
        style: "Riverside Hall",
        vibe: "Sacred Tirupati ambience by the river with devotional setting",
        rating: 4.2,
        priceRange: "₹4L–₹11L",
        features: ["Riverside Décor", "Temple Proximity", "Devotional Music", "Sattvic Cuisine"],
      },
      {
        name: "Nilgiri Bungalow Venue",
        slug: "nilgiri-bungalow-venue",
        capacity: "80–250",
        style: "Tea Bungalow",
        vibe: "Intimate Nilgiri tea estate bungalow with serene hill views",
        rating: 4.3,
        priceRange: "₹4L–₹10L",
        features: ["Hill Views", "Intimate Setting", "Fresh Tea", "Cozy Interiors"],
      },
    ],
    budget: [
      {
        name: "Village Temple Ground",
        slug: "village-temple-ground",
        capacity: "100–500",
        style: "Temple Ground",
        vibe: "Sacred temple grounds for traditional South Indian ceremonies",
        rating: 4.0,
        priceRange: "₹80K–₹3L",
        features: ["Temple Space", "Traditional Rituals", "Banana Leaf Meals", "Local Nadaswaram"],
      },
      {
        name: "Local Hall Community Space",
        slug: "local-hall-community-space",
        capacity: "80–300",
        style: "Community Hall",
        vibe: "Simple, traditional community setting for Tamil family weddings",
        rating: 3.7,
        priceRange: "₹70K–₹2.5L",
        features: ["AC Hall", "Basic Décor", "Local Catering", "Parking"],
      },
    ],
  },
  delhi: {
    premium: [
      {
        name: "Delhi Farm House Estate",
        slug: "premium",
        capacity: "300–2000",
        style: "Luxury Farm",
        vibe: "Sprawling Delhi farmhouse with cinematic Bollywood wedding energy",
        rating: 4.8,
        priceRange: "₹30L–₹1Cr",
        features: ["Huge Lawns", "Celebrity Décor", "Helicopter Entry", "Rooftop Bar"],
      },
    ],
    mid: [
      {
        name: "Delhi Garden Banquet",
        slug: "mid",
        capacity: "200–600",
        style: "Garden Banquet",
        vibe: "Charming Delhi garden venue with city skyline backdrops",
        rating: 4.4,
        priceRange: "₹8L–₹22L",
        features: ["Skyline Views", "Large Lawns", "Multi-Cuisine", "LED Stage"],
      },
    ],
    budget: [
      {
        name: "Delhi Community Hall",
        slug: "budget",
        capacity: "100–400",
        style: "Community Hall",
        vibe: "Affordable and accessible Delhi hall for family celebrations",
        rating: 3.8,
        priceRange: "₹1.5L–₹5L",
        features: ["AC Hall", "Basic Setup", "Local Catering", "Parking"],
      },
    ],
  },
};

// ─── RELIGION ENGINE ──────────────────────────────────────────────────────────
const RELIGION_DATA = {
  hindu: {
    ceremonies: [
      {
        id: "roka",
        name: "Roka Ceremony",
        day: -30,
        time: "10:00 AM",
        duration: "2 hrs",
        description:
          "The formal family announcement — the first sacred step. Families exchange gifts, sweets, and blessings as the couple's union is officially declared.",
        decor: "engagement",
        color: "#FFF3E0",
        icon: "💍",
      },
      {
        id: "haldi",
        name: "Haldi & Mehendi Morning",
        day: -1,
        time: "10:00 AM",
        duration: "3 hrs",
        description:
          "Sacred turmeric paste applied by loved ones for glow, protection and divine blessings. Marigold showers and yellow everywhere.",
        decor: "haldi",
        color: "#FFF8E1",
        icon: "🌼",
      },
      {
        id: "mehndi",
        name: "Mehndi Afternoon",
        day: -1,
        time: "2:00 PM",
        duration: "4 hrs",
        description:
          "Intricate henna art tells the love story. The deeper the colour, the deeper the love — so they say.",
        decor: "mehndi",
        color: "#FCE4EC",
        icon: "🌸",
      },
      {
        id: "sangeet",
        name: "Sangeet Night",
        day: -1,
        time: "7:00 PM",
        duration: "5 hrs",
        description:
          "Families sing, dance and celebrate. An evening of joy, music and memories before the main event.",
        decor: "sangeet",
        color: "#E8EAF6",
        icon: "🎶",
      },
      {
        id: "wedding",
        name: "Wedding Ceremony",
        day: 0,
        time: "6:00 AM",
        duration: "4 hrs",
        description:
          "Sacred pheras around the fire. Varmala exchange. Seven vows under the mandap — a lifetime of love begins here.",
        decor: "wedding",
        color: "#FCE4EC",
        icon: "🔥",
      },
      {
        id: "reception",
        name: "Wedding Reception",
        day: 0,
        time: "7:00 PM",
        duration: "5 hrs",
        description:
          "Grand ballroom celebration. Music, dining, dancing and blessing from all. The world meets the newlyweds.",
        decor: "reception",
        color: "#E8F5E9",
        icon: "✨",
      },
    ],
    rituals: [
      {
        name: "Ganesh Puja",
        description:
          "Beginning with Lord Ganesh's blessings to remove all obstacles from the path.",
      },
      {
        name: "Varmala Exchange",
        description: "Bride and groom exchange floral garlands before the assembly.",
      },
      {
        name: "Saptapadi (Seven Vows)",
        description: "Seven steps around the sacred fire — each step a lifelong promise.",
      },
      {
        name: "Sindoor Daan",
        description: "The groom applies sindoor to the bride's hairline — the eternal mark.",
      },
      {
        name: "Mangalsutra",
        description: "Sacred black and gold necklace symbolizing the eternal bond.",
      },
      {
        name: "Vidaai",
        description:
          "The emotional farewell — bride leaves her family home as a new chapter begins.",
      },
    ],
    mandapStyles: { premium: "royal", mid: "floral", budget: "traditional" },
    brideOutfit: { premium: "lehenga", mid: "lehenga", budget: "saree" },
    groomOutfit: { premium: "sherwani", mid: "sherwani", budget: "kurta" },
    coupleStyle: { premium: "royal", mid: "matching", budget: "matching" },
    foodStyle: "north-indian",
    decorTheme: "wedding",
    musicVibe: "Bollywood hits, Sufi, classical shehnai, live dhol",
    photography: ["traditional", "candid", "cinematic", "emotional"],
  },
  muslim: {
    ceremonies: [
      {
        id: "mangni",
        name: "Mangni (Engagement)",
        day: -15,
        time: "5:00 PM",
        duration: "3 hrs",
        description:
          "Sacred engagement ceremony with exchange of rings and Quranic readings. Families formally agree to the union.",
        decor: "engagement",
        color: "#E8F5E9",
        icon: "💍",
      },
      {
        id: "mehndi",
        name: "Mehndi Evening",
        day: -1,
        time: "5:00 PM",
        duration: "4 hrs",
        description:
          "Bride's hands adorned with intricate henna. Qawwali music fills the air as families celebrate together.",
        decor: "mehndi",
        color: "#FCE4EC",
        icon: "🌸",
      },
      {
        id: "nikah",
        name: "Nikah Ceremony",
        day: 0,
        time: "11:00 AM",
        duration: "2 hrs",
        description:
          "The sacred Islamic marriage contract. Imam leads the ceremony. Qubool hai — three words, one eternal commitment.",
        decor: "nikah",
        color: "#E8EAF6",
        icon: "🕌",
      },
      {
        id: "walima",
        name: "Walima Reception",
        day: 1,
        time: "6:00 PM",
        duration: "5 hrs",
        description:
          "Grand reception feast hosted by the groom's family. A celebration of the new union — halal delicacies, live qawwali, and joy.",
        decor: "reception",
        color: "#FFF8E1",
        icon: "✨",
      },
    ],
    rituals: [
      {
        name: "Nikah Reading",
        description: "Imam recites Quranic verses and solemnizes the marriage contract.",
      },
      {
        name: "Mehr (Dowry Promise)",
        description: "Groom promises a gift/mehr to the bride as a right and token of respect.",
      },
      {
        name: "Qubool Hai",
        description: "Both parties accept three times — the marriage is complete.",
      },
      {
        name: "Dua & Blessing",
        description: "Prayers offered for the couple's happiness and prosperous future.",
      },
      {
        name: "Rukhsati",
        description: "Bride departs from her parents' home — deeply emotional and sacred moment.",
      },
    ],
    mandapStyles: { premium: "luxury", mid: "floral", budget: "minimal" },
    brideOutfit: { premium: "sharara", mid: "sharara", budget: "saree" },
    groomOutfit: { premium: "sherwani", mid: "sherwani", budget: "kurta" },
    coupleStyle: { premium: "luxury", mid: "matching", budget: "matching" },
    foodStyle: "muslim",
    decorTheme: "nikah",
    musicVibe: "Qawwali, Naat, Sufi music, tasteful Bollywood",
    photography: ["candid", "traditional", "emotional"],
  },
  christian: {
    ceremonies: [
      {
        id: "engagement",
        name: "Engagement Ceremony",
        day: -30,
        time: "6:00 PM",
        duration: "3 hrs",
        description:
          "Ring exchange and family celebration. The beginning of a beautiful journey witnessed by loved ones.",
        decor: "engagement",
        color: "#E3F2FD",
        icon: "💍",
      },
      {
        id: "bachelorette",
        name: "Pre-Wedding Celebrations",
        day: -1,
        time: "7:00 PM",
        duration: "4 hrs",
        description: "Friends-only night of memories, laughter and celebration before the big day.",
        decor: "reception",
        color: "#FCE4EC",
        icon: "🥂",
      },
      {
        id: "wedding",
        name: "Church Wedding",
        day: 0,
        time: "10:00 AM",
        duration: "2 hrs",
        description:
          'Walking down the flower-lined aisle. Exchanging vows before God. "I do" echoes through sacred halls.',
        decor: "church",
        color: "#FFFFFF",
        icon: "⛪",
      },
      {
        id: "reception",
        name: "Reception Gala",
        day: 0,
        time: "7:00 PM",
        duration: "5 hrs",
        description:
          "Elegant ballroom reception. Cake cutting, first dance, champagne toasts — a cinematic evening.",
        decor: "reception",
        color: "#E8EAF6",
        icon: "✨",
      },
    ],
    rituals: [
      {
        name: "Processional Walk",
        description: "Bride walks the aisle accompanied by flower girls and bridesmaids.",
      },
      {
        name: "Exchange of Vows",
        description: "Personal promises spoken before God, family and friends.",
      },
      { name: "Ring Exchange", description: "Wedding bands placed as eternal symbols of love." },
      {
        name: "First Kiss",
        description: "The couple's first kiss as husband and wife before the congregation.",
      },
      { name: "Signing of Register", description: "Legal solemnization witnessed by family." },
      { name: "First Dance", description: "Romantic first dance as a married couple." },
    ],
    mandapStyles: { premium: "luxury", mid: "floral", budget: "minimal" },
    brideOutfit: { premium: "bridal-gown", mid: "bridal-gown", budget: "bridal-gown" },
    groomOutfit: { premium: "tuxedo", mid: "tuxedo", budget: "indo-western" },
    coupleStyle: { premium: "luxury", mid: "pastel", budget: "pastel" },
    foodStyle: "luxury-dining",
    decorTheme: "church",
    musicVibe: "Choir, classical orchestra, romantic ballads, light Bollywood",
    photography: ["cinematic", "couple", "drone", "night-shoot"],
  },
  sikh: {
    ceremonies: [
      {
        id: "chunni",
        name: "Chunni Ceremony",
        day: -15,
        time: "11:00 AM",
        duration: "2 hrs",
        description:
          "Groom's family drapes a red chunni on the bride — the first formal bond between families.",
        decor: "engagement",
        color: "#FFF3E0",
        icon: "🧣",
      },
      {
        id: "mehndi",
        name: "Mehndi & Sangeet",
        day: -1,
        time: "5:00 PM",
        duration: "5 hrs",
        description:
          "Henna, music and Giddha dances. Sikh songs and folk traditions fill the evening with golden warmth.",
        decor: "mehndi",
        color: "#FCE4EC",
        icon: "🌸",
      },
      {
        id: "anand-karaj",
        name: "Anand Karaj",
        day: 0,
        time: "8:00 AM",
        duration: "3 hrs",
        description:
          "Sikh wedding ceremony at the Gurudwara. Four Laavan (rounds) around the Guru Granth Sahib — each a sacred promise.",
        decor: "wedding",
        color: "#E8F5E9",
        icon: "🕌",
      },
      {
        id: "reception",
        name: "Reception Banquet",
        day: 0,
        time: "7:00 PM",
        duration: "5 hrs",
        description:
          "Lavish Punjabi reception. Bhangra performances, langar feast, and joyful family celebrations.",
        decor: "reception",
        color: "#E8EAF6",
        icon: "✨",
      },
    ],
    rituals: [
      {
        name: "Ardas (Prayer)",
        description: "Opening prayer seeking Waheguru's blessings for the ceremony.",
      },
      {
        name: "Four Laavan",
        description: "Granthi recites four rounds of Lavan — each circling the Guru Granth Sahib.",
      },
      { name: "Anand Sahib", description: "Hymn of bliss sung to celebrate the divine union." },
      { name: "Karah Prasad", description: "Sacred sweet offered to all — blessed by the Guru." },
      {
        name: "Langar",
        description: "Community meal — everyone equal at the table, no distinctions.",
      },
    ],
    mandapStyles: { premium: "royal", mid: "floral", budget: "traditional" },
    brideOutfit: { premium: "lehenga", mid: "lehenga", budget: "saree" },
    groomOutfit: { premium: "sherwani", mid: "sherwani", budget: "kurta" },
    coupleStyle: { premium: "royal", mid: "royal", budget: "matching" },
    foodStyle: "north-indian",
    decorTheme: "wedding",
    musicVibe: "Shabad Kirtan, Bhangra, Giddha, Dhol & Nagaras",
    photography: ["traditional", "candid", "cinematic", "drone"],
  },
  "south-indian": {
    ceremonies: [
      {
        id: "nischayam",
        name: "Nischayathartham (Engagement)",
        day: -30,
        time: "10:00 AM",
        duration: "3 hrs",
        description:
          "Official engagement with exchange of gifts, flowers and family blessings. Nadaswaram music sets the divine tone.",
        decor: "engagement",
        color: "#FFF8E1",
        icon: "💍",
      },
      {
        id: "mehndi",
        name: "Mehndi & Nalangu",
        day: -1,
        time: "4:00 PM",
        duration: "4 hrs",
        description:
          "Playful Nalangu rituals — games between bride and groom's family. Henna and fun combined.",
        decor: "mehndi",
        color: "#FCE4EC",
        icon: "🌸",
      },
      {
        id: "wedding",
        name: "Muhurtham (Wedding)",
        day: 0,
        time: "7:00 AM",
        duration: "4 hrs",
        description:
          "At the sacred muhurtham time, sacred thread tied. Mangalsutra adorned. Saptapadi with Vedic chants.",
        decor: "temple",
        color: "#FFF3E0",
        icon: "🌺",
      },
      {
        id: "reception",
        name: "Reception Feast",
        day: 0,
        time: "6:00 PM",
        duration: "4 hrs",
        description:
          "Grand South Indian feast on banana leaves. Classical Bharatanatyam, Carnatic music, and family warmth.",
        decor: "reception",
        color: "#E8F5E9",
        icon: "✨",
      },
    ],
    rituals: [
      {
        name: "Kasi Yatra",
        description:
          "Groom pretends to leave for Kasi — bride's father convinces him to stay and marry.",
      },
      {
        name: "Oonjal (Swing Ceremony)",
        description: "Couple seated on decorated swing, serenaded by women with songs.",
      },
      {
        name: "Maalai Maatral",
        description: "Exchange of flower garlands three times — playful and sacred.",
      },
      {
        name: "Kanyadan",
        description: "Bride's father places her hand in the groom's — the eternal gift.",
      },
      {
        name: "Sapthapadi",
        description: "Seven steps with Vedic chanting — seven promises for seven lives.",
      },
      {
        name: "Mangalya Dharanam",
        description: "Groom ties the sacred thali thread around the bride's neck.",
      },
    ],
    mandapStyles: { premium: "temple", mid: "traditional", budget: "minimal" },
    brideOutfit: { premium: "saree", mid: "saree", budget: "saree" },
    groomOutfit: { premium: "sherwani", mid: "kurta", budget: "kurta" },
    coupleStyle: { premium: "royal", mid: "matching", budget: "matching" },
    foodStyle: "south-indian",
    decorTheme: "temple",
    musicVibe: "Nadaswaram, Carnatic classical, Bharatanatyam, Thavil drums",
    photography: ["traditional", "candid", "emotional", "prewedding"],
  },
};

// ─── STATE PERSONALIZATION DATA ───────────────────────────────────────────────
const STATE_PERSONALITY = {
  rajasthan: {
    vibe: "Royal Desert Romance",
    signature: "Elephant processions, camel rides, folk performances",
    foods: ["Dal Baati Churma", "Ker Sangri", "Ghewar", "Rajasthani Thali", "Malpua"],
    flowers: ["Marigold", "Rose", "Jasmine", "Rajni Gandha"],
    entertainment: ["Kalbeliya Dance", "Bhopa Bhopi", "Puppet Show", "Camel Safari"],
    color: "#D4A017",
  },
  kerala: {
    vibe: "Tropical Backwater Bliss",
    signature: "Elephant blessings, houseboat ceremonies, jasmine garlands",
    foods: ["Sadhya (Banana Leaf Feast)", "Payasam", "Appam & Stew", "Fish Curry", "Puttu"],
    flowers: ["Jasmine", "Lotus", "Marigold", "Hibiscus"],
    entertainment: ["Kathakali", "Mohiniyattam", "Thrissur Pooram Drumming", "Boat Race Theme"],
    color: "#2E7D32",
  },
  goa: {
    vibe: "Tropical Beach Romance",
    signature: "Sunset mandap on the beach, tropical blooms, DJ nights",
    foods: ["Prawn Balchão", "Fish Curry Rice", "Bebinca", "Vindaloo", "Seafood Platter"],
    flowers: ["Plumeria", "Bird of Paradise", "Orchids", "Tropical Leaves"],
    entertainment: ["Live Band", "DJ", "Fire Dancers", "Sunset Cruise"],
    color: "#0097A7",
  },
  maharashtra: {
    vibe: "Maratha Heritage Grandeur",
    signature: "Horse entry, Maratha pageantry, vineyard receptions",
    foods: ["Puran Poli", "Modak", "Sabudana Khichdi", "Varan Bhaat", "Shrikhand"],
    flowers: ["Marigold", "Mogra", "Lotus", "Chrysanthemum"],
    entertainment: ["Lavani Dance", "Dhol Tasha", "Band Baaja", "Tamasha"],
    color: "#FF6F00",
  },
  karnataka: {
    vibe: "Garden City Elegance",
    signature: "Silk Mysore sarees, jasmine-scented gardens, royal Mysore backdrop",
    foods: ["Bisibele Bath", "Mysore Pak", "Dosa Varieties", "Obbattu", "Puliyogare"],
    flowers: ["Jasmine", "Marigold", "Kanakambara", "Rose"],
    entertainment: ["Yakshagana", "Dollu Kunitha", "Classical Carnatic", "Traditional Drums"],
    color: "#4A148C",
  },
  punjab: {
    vibe: "Grand Punjabi Exuberance",
    signature: "Bhangra, Giddha, flower showers, tractor baraat",
    foods: ["Butter Chicken", "Makki di Roti & Sarson da Saag", "Lassi", "Chole Bhature", "Pinni"],
    flowers: ["Marigold", "Gladiolus", "Rose", "Tuberose"],
    entertainment: ["Bhangra Troupe", "Giddha", "Dhol Players", "Live Band", "Comedy Acts"],
    color: "#E65100",
  },
  "tamil-nadu": {
    vibe: "Divine Dravidian Tradition",
    signature: "Nadaswaram music, silk kanjeevarams, banana leaf feast, temple backdrop",
    foods: ["Sambar Rice", "Curd Rice", "Payasam", "Vada Curry", "South Indian Thali"],
    flowers: ["Jasmine (Mullai)", "Marigold", "Chrysanthemum", "Lotus"],
    entertainment: ["Bharatanatyam", "Nadaswaram Orchestra", "Thavil Drums", "Classical Carnatic"],
    color: "#B71C1C",
  },
  delhi: {
    vibe: "Bollywood Grand Wedding",
    signature: "Helicopter entry, celebrity-style decor, farmhouse grandeur",
    foods: ["Butter Chicken", "Dal Makhani", "Tandoori Platter", "Chaat", "Mithai Selection"],
    flowers: ["Rose", "Marigold", "Orchids", "Lilies"],
    entertainment: ["Bollywood DJ", "Celebrity Act", "LED Shows", "Drone Displays"],
    color: "#880E4F",
  },
};

const calculateBudget = (totalBudget, tier, guestCount, priorities = []) => {
  // Base allocation ratios that shift based on total budget amount
  let venuePct, cateringPct, decorPct, photoPct, outfitPct, makeupPct, entertainmentPct, miscPct;

  if (totalBudget >= 5000000) {
    // Ultra Luxury: Venues and Decor take a massive chunk, catering cost per head is high but % drops relative to the venue palace costs
    venuePct = 35; cateringPct = 20; decorPct = 20; photoPct = 10; outfitPct = 7; makeupPct = 3; entertainmentPct = 4; miscPct = 1;
  } else if (totalBudget >= 2500000) {
    // Premium
    venuePct = 30; cateringPct = 25; decorPct = 18; photoPct = 10; outfitPct = 7; makeupPct = 3; entertainmentPct = 4; miscPct = 3;
  } else if (totalBudget >= 1200000) {
    // Mid-Premium
    venuePct = 28; cateringPct = 28; decorPct = 16; photoPct = 9; outfitPct = 7; makeupPct = 3; entertainmentPct = 4; miscPct = 5;
  } else if (totalBudget >= 800000) {
    // Mid
    venuePct = 25; cateringPct = 30; decorPct = 15; photoPct = 9; outfitPct = 8; makeupPct = 4; entertainmentPct = 3; miscPct = 6;
  } else {
    // Budget (< 8L): Catering dominates because food for guests is the fixed major cost. Venue is simple hall.
    venuePct = 18; cateringPct = 38; decorPct = 12; photoPct = 8; outfitPct = 10; makeupPct = 5; entertainmentPct = 2; miscPct = 7;
  }

  // Priority boosts (if user selected priorities in the quiz)
  if (priorities.includes("luxury_decor") || priorities.includes("decor")) {
    decorPct += 5;
    cateringPct -= 3;
    miscPct -= 2;
  }
  if (priorities.includes("photography") || priorities.includes("cinematic_photography")) {
    photoPct += 3;
    venuePct -= 2;
    miscPct -= 1;
  }
  if (priorities.includes("food") || priorities.includes("gourmet_food")) {
    cateringPct += 5;
    decorPct -= 2;
    venuePct -= 2;
    miscPct -= 1;
  }
  if (priorities.includes("entertainment")) {
    entertainmentPct += 3;
    miscPct -= 3;
  }

  // Normalize percentages just in case they don't perfectly add to 100 after shifts
  const totalPct = venuePct + cateringPct + decorPct + photoPct + outfitPct + makeupPct + entertainmentPct + miscPct;
  const factor = 100 / totalPct;
  
  const breakdown = {
    venue: Math.round((venuePct * factor / 100) * totalBudget),
    catering: Math.round((cateringPct * factor / 100) * totalBudget),
    decor: Math.round((decorPct * factor / 100) * totalBudget),
    photography: Math.round((photoPct * factor / 100) * totalBudget),
    outfits: Math.round((outfitPct * factor / 100) * totalBudget),
    makeup: Math.round((makeupPct * factor / 100) * totalBudget),
    entertainment: Math.round((entertainmentPct * factor / 100) * totalBudget),
    misc: Math.round((miscPct * factor / 100) * totalBudget),
  };

  const perGuestCost = Math.round(breakdown.catering / Math.max(guestCount, 1)) + Math.round((totalBudget - breakdown.catering) / Math.max(guestCount, 1));

  const tierLabels = {
    premium: "Luxury Premium",
    mid: "Balanced Mid-Range",
    budget: "Smart Budget",
  };

  return {
    total: totalBudget,
    tier: tierLabels[tier] || tier,
    perGuestCost,
    breakdown,
    categories: Object.fromEntries(
      Object.entries(breakdown).map(([k, v]) => [
        k,
        {
          value: v,
          percentage: Math.round((v / totalBudget) * 100),
          formatted: `₹${(v / 100000).toFixed(1)}L`,
        },
      ]),
    ),
    summary: `Your total budget of ₹${(totalBudget / 100000).toFixed(1)} Lakhs across ${guestCount} guests works out to ₹${perGuestCost.toLocaleString("en-IN")} per guest — a ${tierLabels[tier] || tier} experience.`,
  };
};

// ─── ASSET PATH RESOLVER ──────────────────────────────────────────────────────
const getAssetPath = (category, ...parts) => `/assets/${category}/${parts.join("/")}`;

const resolveVenueImage = (state, tier, slug) =>
  `/assets/venues/${state}/${tier}/${slug}`;

const resolveDecorImage = (event, tier) => getAssetPath("decor", event, tier);

const resolveMandapImage = (style, tier) => getAssetPath("mandap", style, tier);

const resolveOutfitImage = (who, type, tier) => getAssetPath("outfits", who, type, tier);

const resolvePhotographyImage = (style) => `/assets/photography/${style}`;

const resolveFoodImage = (type) => `/assets/food/${type}`;

const resolveEntertainmentImage = (type, tier) => {
  const hasTier = ["entry", "fireworks", "live-band"].includes(type);
  return hasTier
    ? `/assets/entertainment/${type}/${tier}`
    : `/assets/entertainment/${type}`;
};

// ─── CHECKLIST GENERATOR ──────────────────────────────────────────────────────
const generateChecklist = (religion, tier, state, guestCount) => {
  const religionData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;

  const months12 = [
    "Fix your wedding date using an auspicious muhurtham or family consensus",
    "Set a realistic total budget with a 10% contingency fund",
    `Book your ${tier === "premium" ? "palace or heritage" : tier === "mid" ? "resort or garden" : "banquet hall or ground"} venue — they book fast!`,
    "Finalize the wedding planner or coordinator",
  ];
  const months6 = [
    "Book your wedding photographer and videographer",
    "Begin outfit shopping — allow 3–4 fittings",
    `Book ${religionData.musicVibe.split(",")[0]} performers and DJ`,
    "Finalize catering menu with at least 3 tastings",
    "Send save-the-date cards to outstation guests",
    "Book block rooms for guests at a nearby hotel",
  ];
  const months3 = [
    "Send formal wedding invitations (physical + digital)",
    "Finalize decor theme and book decorator",
    "Book makeup artist with trial session",
    "Confirm transport arrangements for baraat",
    "Book accommodation for relatives",
  ];
  const months1 = [
    "Confirm final guest count and seating plan",
    "Final outfit fitting and accessory check",
    "Confirm all vendor bookings with advance payments",
    "Prepare wedding day emergency kit",
    "Set aside mehendi, haldi and ceremony essentials",
    "Brief family members on ceremony duties",
  ];

  return [
    { phase: "12 Months Before", tasks: months12, icon: "📅" },
    { phase: "6 Months Before", tasks: months6, icon: "📋" },
    { phase: "3 Months Before", tasks: months3, icon: "✅" },
    { phase: "1 Month Before", tasks: months1, icon: "🎯" },
    {
      phase: "Religion-Specific",
      tasks: religionData.rituals
        .slice(0, 4)
        .map((r) => `Arrange for ${r.name}: ${r.description.split(".")[0]}`),
      icon: "🙏",
    },
  ];
};

// ─── TIMELINE GENERATOR ──────────────────────────────────────────────────────
const generateTimeline = (ceremonies, weddingDate = "Your Wedding Day") => {
  return ceremonies.map((c) => ({
    id: c.id,
    event: c.name,
    day:
      c.day === 0
        ? weddingDate
        : c.day < 0
          ? `${Math.abs(c.day)} Day${Math.abs(c.day) > 1 ? "s" : ""} Before`
          : `${c.day} Day${c.day > 1 ? "s" : ""} After`,
    time: c.time,
    duration: c.duration,
    description: c.description,
    color: c.color,
    icon: c.icon,
  }));
};

// ─── ENTERTAINMENT ENGINE ─────────────────────────────────────────────────────
const getEntertainment = (religion, tier, state) => {
  const statePersonality = STATE_PERSONALITY[state] || STATE_PERSONALITY.rajasthan;

  const common = [
    {
      type: "Fireworks & Pyrotechnics",
      image: resolveEntertainmentImage("fireworks", tier),
      description: "Sky-lit grand finale",
      tier: ["premium", "mid"],
    },
    {
      type: "DJ Night",
      image: resolveEntertainmentImage("dj"),
      description: "Curated playlist — Bollywood, EDM, retro hits",
    },
    {
      type: "Live Band",
      image: resolveEntertainmentImage("live-band", tier),
      description: "Live music for baraat, sangeet and reception",
    },
    {
      type: "Dance Performances",
      image: resolveEntertainmentImage("dance"),
      description: "Choreographed family performances",
    },
    {
      type: "Grand Entry Setup",
      image: resolveEntertainmentImage("entry", tier),
      description: "Memorable baraat or bridal entry",
    },
  ];

  const localEntertainment = statePersonality.entertainment.map((e) => ({
    type: e,
    image: resolveEntertainmentImage("dance"),
    description: `Traditional ${state} performance`,
    local: true,
  }));

  const tierSpecific =
    tier === "premium"
      ? [
          {
            type: "Celebrity Performance",
            image: resolveEntertainmentImage("celebrity"),
            description: "Top artist/singer for the occasion",
          },
        ]
      : [];

  return [...tierSpecific, ...localEntertainment.slice(0, 2), ...common].slice(0, 6);
};

// ─── FOOD ENGINE ──────────────────────────────────────────────────────────────
const getFood = (religion, tier, state) => {
  const relData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;
  const stateData = STATE_PERSONALITY[state] || STATE_PERSONALITY.rajasthan;
  const foodStyle = relData.foodStyle;

  const specialties = stateData.foods.slice(0, 5);

  const categories = [
    {
      name: "Main Cuisine",
      style: foodStyle,
      image: resolveFoodImage(foodStyle),
      dishes: specialties.slice(0, 3),
      description: `Authentic ${state} flavours crafted by master chefs`,
    },
    {
      name: "Live Counters",
      style: "live-counters",
      image: resolveFoodImage("live-counters"),
      dishes: ["Live Chaat Station", "Kebab Corner", "Dosa/Idli Live", "Dessert Fondue"],
      description: "Interactive food stations that delight guests",
    },
    {
      name: "Desserts & Mithai",
      style: "desserts",
      image: resolveFoodImage("desserts"),
      dishes: specialties.slice(3, 5).concat(["Gulab Jamun", "Kulfi", "Wedding Cake"]),
      description: "Sweet endings to remember",
    },
    {
      name: "Beverages",
      style: "beverages",
      image: resolveFoodImage("beverages"),
      dishes: ["Welcome Drink", "Lassi/Sharbat", "Fresh Juice Bar", "Specialty Teas"],
      description: "Refreshing welcome drinks and bar service",
    },
  ];

  if (tier === "premium") {
    categories.push({
      name: "Luxury Dining Experience",
      style: "luxury-dining",
      image: resolveFoodImage("luxury-dining"),
      dishes: [
        "Plated 7-Course Menu",
        "Chef's Table",
        "International Cuisine Station",
        "Live Grill",
      ],
      description: "A fine dining experience for premium celebrations",
    });
  }

  return categories;
};

// ─── PHOTOGRAPHY ENGINE ───────────────────────────────────────────────────────
const getPhotography = (religion, tier) => {
  const relData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;
  const styles = relData.photography;

  const packages = {
    premium: {
      name: "Cinematic Luxury Package",
      deliverables: [
        "4K Cinematic Film (15–30 min)",
        "Drone Coverage",
        "Same-Day Edit",
        "Pre-Wedding Shoot",
        "2000+ Edited Photos",
        "Wedding Album (Italian Leather)",
        "Digital Gallery",
      ],
      team: "4 Photographers + 2 Videographers + Drone Pilot",
      description:
        "Every moment captured as a timeless story — cinematic, dramatic, unforgettable.",
    },
    mid: {
      name: "Premium Documentation Package",
      deliverables: [
        "Full HD Wedding Film (10–20 min)",
        "1200+ Edited Photos",
        "Pre-Wedding Shoot",
        "Photobook",
        "USB Drive Delivery",
      ],
      team: "2 Photographers + 1 Videographer",
      description: "Professional coverage ensuring every memory is beautifully preserved.",
    },
    budget: {
      name: "Essential Coverage Package",
      deliverables: [
        "Wedding Highlights Film (5–8 min)",
        "600+ Photos",
        "Online Gallery",
        "Digital Delivery",
      ],
      team: "1 Photographer + 1 Videographer",
      description: "Quality documentation of your most important moments.",
    },
  };

  return {
    package: packages[tier] || packages.mid,
    styles: styles.map((s) => ({
      style: s,
      image: resolvePhotographyImage(s),
      description:
        {
          candid: "Unposed moments of real emotion — laughter, tears, joy",
          cinematic: "Dramatic lighting, cinematic framing — every frame a film still",
          traditional: "Posed family portraits and ritual documentation",
          emotional: "Raw emotional moments that tell the true story",
          couple: "Romantic couple portraits — pre-wedding to reception",
          drone: "Aerial perspectives revealing the grand scale of your celebration",
          "night-shoot": "Golden hour and night photography — magical lighting",
          prewedding: "Pre-wedding shoot at a curated location",
          traditional: "Classic posed portraits for family memories",
        }[s] || "Beautiful photography moments",
    })),
    ideas: [
      "Golden hour baraat shots",
      "Veil/Dupatta flying shots",
      "Silhouette mandap portraits",
      "Candid family emotion moments",
      "Detail shots — jewellery, mehndi, shoes",
      "Couple under flower shower",
    ],
  };
};

// ─── OUTFIT ENGINE ────────────────────────────────────────────────────────────
const getOutfits = (religion, tier, state) => {
  const relData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;
  const brideType = relData.brideOutfit[tier] || "lehenga";
  const groomType = relData.groomOutfit[tier] || "sherwani";
  const coupleType = relData.coupleStyle[tier] || "matching";

  const outfitDescriptions = {
    lehenga:
      "Hand-embroidered lehenga in rich silks with intricate zari work — the quintessential Indian bridal look.",
    saree:
      "Draped in six yards of elegance — Kanjeevaram or Banarasi saree for the perfect traditional look.",
    sharara: "Flowing sharara with intricate threadwork — regal and graceful for the Muslim bride.",
    "bridal-gown":
      "Ethereal white bridal gown with cathedral-length veil — timeless Christian bridal beauty.",
    sherwani: "Heritage embroidered sherwani with gold detailing — the ultimate groom statement.",
    kurta: "Elegant silk kurta-pajama with matching dupatta — understated, sophisticated.",
    tuxedo: "Tailored black-tie tuxedo with silk lapels — suave and timeless.",
    "indo-western": "Designer indo-western fusion — modernity meets tradition.",
  };

  return {
    bride: {
      type: brideType,
      image: resolveOutfitImage("bride", brideType, tier),
      description: outfitDescriptions[brideType] || "Beautiful bridal attire",
      accessories:
        tier === "premium"
          ? [
              "Polki/Kundan Jewellery Set",
              "Pearl Haar",
              "Maang Tikka",
              "Designer Bridal Clutch",
              "Embroidered Jutis",
            ]
          : ["Traditional Jewellery Set", "Maang Tikka", "Bangles", "Classic Bridal Heels"],
    },
    groom: {
      type: groomType,
      image: resolveOutfitImage("groom", groomType, tier),
      description: outfitDescriptions[groomType] || "Elegant groom attire",
      accessories:
        tier === "premium"
          ? [
              "Designer Safa/Turban",
              "Vintage Brooch",
              "Kolhapuri Shoes",
              "Pocket Square",
              "Heritage Watch",
            ]
          : ["Traditional Safa", "Mojri/Shoes", "Classic Watch"],
    },
    couple: {
      style: coupleType,
      image: resolveOutfitImage("couple", coupleType, tier),
      description:
        "Coordinated couple looks for a stunning visual narrative across all ceremonies.",
    },
  };
};

// ─── DECOR ENGINE ─────────────────────────────────────────────────────────────
const getDecorSuggestions = (religion, tier, state, ceremonies) => {
  const relData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;
  const stateData = STATE_PERSONALITY[state] || STATE_PERSONALITY.rajasthan;
  const flowers = stateData.flowers;

  return ceremonies.map((ceremony) => ({
    event: ceremony.name,
    icon: ceremony.icon,
    image: resolveDecorImage(ceremony.decor, tier),
    theme:
      {
        haldi: `Marigold Sunshine — cascading yellow and orange blooms, earthen pots, rustic charm`,
        mehndi: `Boho Floral Paradise — pastel roses, dreamcatchers, bohemian hanging florals`,
        sangeet: `Electric Glam Night — LED dance floor, geometric backdrops, neon accents`,
        wedding: `${tier === "premium" ? "Royal Heritage Mandap" : "Elegant Floral Mandap"} — ${flowers.slice(0, 2).join(" & ")} clusters with silk drapes`,
        reception: `Ballroom Opulence — crystal chandeliers, white florals, warm candlelight`,
        nikah: `Emerald & Gold — Islamic geometric patterns, chandelier clusters, rose gold accents`,
        church: `White & Gold Cathedral — white roses, eucalyptus garlands, aisle petals`,
        temple: `Jasmine & Lotus — temple-inspired floral arches, oil lamps, silk hangings`,
        engagement: `Romantic Garden — pastel blooms, fairy lights, elegant table settings`,
      }[ceremony.decor] || `${tier} ${ceremony.decor} décor with ${flowers[0]} florals`,
    palette: ceremony.color,
    flowers: flowers.slice(0, 3),
    elements:
      tier === "premium"
        ? [
            "Crystal Chandeliers",
            "Draped Silk Canopy",
            "Floral Ceiling Installation",
            "LED Backdrop",
            "Fragrance Diffusers",
          ]
        : tier === "mid"
          ? ["Fairy Lights", "Floral Garlands", "Draped Fabric", "Candle Clusters", "LED Accents"]
          : ["Simple Florals", "Coloured Lights", "Fabric Draping", "Balloon Décor"],
  }));
};

// ─── MANDAP ENGINE ────────────────────────────────────────────────────────────
const getMandapDetails = (religion, tier, state) => {
  const relData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;
  const style = relData.mandapStyles[tier] || "traditional";
  const stateData = STATE_PERSONALITY[state] || { flowers: ["Marigold", "Rose"] };

  const descriptions = {
    royal: `Majestic four-pillared mandap in gold and crimson — inspired by Mughal and Rajput architecture. Silk drapes cascade from the canopy, adorned with ${stateData.flowers[0]} and rose garlands.`,
    floral: `A cascading floral paradise — thousands of fresh ${stateData.flowers[0]} and ${stateData.flowers[1] || "rose"} blooms create a fragrant, garden-like sacred space.`,
    temple: `Temple-inspired mandap with carved wooden pillars, oil lamps and jasmine strings — divine South Indian ambience.`,
    luxury: `Ultra-modern luxury mandap with Italian marble finish, crystal chandeliers, and dramatic lighting — cinematic and breathtaking.`,
    traditional: `Classic traditional mandap with natural wood, marigold garlands and traditional fabric — authentic and grounded.`,
    minimal: `Clean, minimalist mandap with white flowers and simple elegance — contemporary and tasteful.`,
    beach: `Open-air beach mandap with driftwood pillars, tropical blooms and ocean backdrop — nature's own cathedral.`,
  };

  return {
    style,
    image: resolveMandapImage(style, tier),
    description: descriptions[style] || `Beautiful ${style} mandap design`,
    features:
      tier === "premium"
        ? [
            "24K Gold Pillars",
            "Crystal Chandelier Crown",
            "Real Flower Ceiling",
            "Custom Monogram",
            "Fragrance Misters",
          ]
        : tier === "mid"
          ? [
              "Ornate Fabric Canopy",
              "Fresh Flower Pillars",
              "Fairy Light Ceiling",
              "Decorative Urns",
            ]
          : ["Traditional Wood Pillars", "Marigold Garlands", "Colourful Fabric", "Basic Lighting"],
    seating: {
      description: "Maharaja chairs and custom stage seating",
      image: resolveDecorImage(relData.decorTheme, tier),
    },
  };
};

// ─── PLANNING VAULT ───────────────────────────────────────────────────────────
const getPlanningVault = (religion, tier, state, primaryVenue) => {
  const stateData = STATE_PERSONALITY[state] || STATE_PERSONALITY.rajasthan;
  const relData = RELIGION_DATA[religion] || RELIGION_DATA.hindu;

  return {
    invitations: {
      style: {
        premium: "Foil-stamped boxed invitation with wax seal and personalized scrolls",
        mid: "Premium printed card set with embossed border and envelope liner",
        budget: "Elegant printed invitation with digital e-invite package",
      }[tier],
      image: getAssetPath("decor", "engagement", tier),
      tips: [
        "Order 25% extra for last-minute additions",
        "Add a QR code linking to your wedding website",
        "Hand-deliver to VIP family members",
        "Include accommodation details for outstation guests",
      ],
    },
    honeymoon: {
      suggestions:
        tier === "premium"
          ? [
              { destination: "Maldives Water Villas", vibe: "Over-water bungalow paradise" },
              { destination: "Switzerland Alps", vibe: "Snow-capped romantic escape" },
              { destination: "Bali, Indonesia", vibe: "Tropical temple romance" },
            ]
          : tier === "mid"
            ? [
                { destination: "Kashmir Valley", vibe: "Heaven on Earth" },
                { destination: "Coorg Hill Station", vibe: "Misty coffee country romance" },
                { destination: "Andaman Islands", vibe: "Crystal clear seas" },
              ]
            : [
                { destination: "Ooty & Kodaikanal", vibe: "Hill station tranquility" },
                { destination: "Goa Beaches", vibe: "Sun, sea and serenity" },
              ],
      image: resolvePhotographyImage("couple"),
    },
    masterChecklist: generateChecklist(religion, tier, state, 200),
    timeline: relData.ceremonies.map((c) => ({ event: c.name, day: c.day, time: c.time })),
    localTraditions: stateData,
  };
};

// ─── MAIN GENERATE PLAN FUNCTION ──────────────────────────────────────────────
const generatePlan = ({
  budget = 1000000,
  religion = "hindu",
  guests = 200,
  location = "rajasthan",
  theme = "royal",
  priorities = [],
  season = "winter",
  venueType = null,
}) => {
  // Normalize inputs
  const rel = String(religion)
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  const state = resolveState(location);
  const tier = getTier(Number(budget));

  // Get religion-specific data
  const relData = RELIGION_DATA[rel] || RELIGION_DATA.hindu;
  const stateData = STATE_PERSONALITY[state] || STATE_PERSONALITY.rajasthan;
  const venuePool = VENUE_DB[state]?.[tier] || VENUE_DB.rajasthan[tier];

  // ─── Venues ─────────────────────────────────────────────────────────────
  const venues = (venuePool || []).map((v, i) => ({
    ...v,
    image: resolveVenueImage(state, tier, v.slug),
    rank: i + 1,
    recommended: i === 0,
    matchScore: Math.round(95 - i * 7),
    whyRecommended:
      i === 0
        ? `Perfect match for ${guests} guests with ${rel} ${tier} ceremonies in ${stateData.vibe}`
        : `Alternative option with similar ambience`,
    budgetFit: v.priceRange,
    localTip: stateData.signature,
  }));

  const primaryVenue = venues[0] || { name: "Grand Wedding Venue", slug: "premium" };

  // ─── Ceremonies ──────────────────────────────────────────────────────────
  const ceremonies = relData.ceremonies;

  // ─── Budget ──────────────────────────────────────────────────────────────
  const budgetBreakdown = calculateBudget(Number(budget), tier, Number(guests), priorities);

  // ─── Mandap ──────────────────────────────────────────────────────────────
  const mandap = getMandapDetails(rel, tier, state);

  // ─── Outfits ─────────────────────────────────────────────────────────────
  const outfits = getOutfits(rel, tier, state);

  // ─── Decor ───────────────────────────────────────────────────────────────
  const decorSuggestions = getDecorSuggestions(rel, tier, state, ceremonies);

  // ─── Photography ─────────────────────────────────────────────────────────
  const photography = getPhotography(rel, tier);

  // ─── Food ────────────────────────────────────────────────────────────────
  const food = getFood(rel, tier, state);

  // ─── Entertainment ────────────────────────────────────────────────────────
  const entertainment = getEntertainment(rel, tier, state);

  // ─── Timeline ────────────────────────────────────────────────────────────
  const timeline = generateTimeline(ceremonies);

  // ─── Planning Vault ───────────────────────────────────────────────────────
  const planningVault = getPlanningVault(rel, tier, state, primaryVenue);

  // ─── Image galleries ──────────────────────────────────────────────────────
  const galleries = {
    venues: venues.map((v) => v.image),
    decor: decorSuggestions.map((d) => d.image),
    mandap: [mandap.image],
    bridal: [outfits.bride.image],
    groom: [outfits.groom.image],
    couple: [outfits.couple.image],
    photography: photography.styles.map((s) => s.image),
    food: food.map((f) => f.image),
    entertainment: entertainment.map((e) => e.image),
  };

  // ─── Summary ──────────────────────────────────────────────────────────────
  const summary = {
    title: `${stateData.vibe} — ${relData.musicVibe.split(",")[0]} Wedding`,
    headline: `A ${tier} ${rel.charAt(0).toUpperCase() + rel.slice(1)} wedding in ${state.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} for ${guests} guests`,
    description: `Your dream wedding at ${primaryVenue.name} — ${primaryVenue.vibe}. ${stateData.signature}. A ${tier} celebration featuring ${budgetBreakdown.tier} planning.`,
    guests,
    theme,
    religion: rel,
    location: state,
    tier,
    totalBudget: Number(budget),
    perGuestCost: budgetBreakdown.perGuestCost,
    priorities: Array.isArray(priorities) ? priorities : [priorities],
    season,
    stateVibe: stateData.vibe,
    stateSignature: stateData.signature,
  };

  // ─── Return unified production plan ───────────────────────────────────────
  return {
    // Core plan data
    weddingPlan: summary,
    venues,
    primaryVenue,
    ceremonies,
    rituals: relData.rituals,
    timeline,
    mandap,

    // Styling
    outfits,
    decor: decorSuggestions,
    galleries,

    // Services
    food,
    photography,
    entertainment,

    // Planning tools
    budgetBreakdown,
    planningVault,
    checklist: planningVault.masterChecklist,

    // Legacy compatibility (for existing planner.service.js bridge)
    budget: { total: Number(budget), breakdown: budgetBreakdown.breakdown },
    images: {
      venues: galleries.venues,
      decor: galleries.decor,
      bridal: galleries.bridal,
      groom: galleries.groom,
    },
    events: ceremonies.map((c) => ({ name: c.name, time: c.time, description: c.description })),
    summary: { guests, stateVibe: stateData.vibe },
  };
};

module.exports = {
  generatePlan,
  getTier,
  resolveState,
  VENUE_DB,
  RELIGION_DATA,
  STATE_PERSONALITY,
};
