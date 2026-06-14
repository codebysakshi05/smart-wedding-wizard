/**
 * weddingImageEngine.ts
 * =====================
 * MASTER IMAGE ENGINE — Smart Wedding Wizard
 *
 * Maps every combination of:
 *   - religion (hindu, muslim, christian, sikh, south)
 *   - budget tier (budget, mid, premium)
 *   - state (rajasthan, goa, kerala, etc.)
 *   - event type (haldi, mehndi, nikah, sangeet, reception, etc.)
 *   - outfit type (lehenga, saree, sherwani, tuxedo, etc.)
 *   - mandap style (floral, royal, temple, beach, luxury, minimal, traditional)
 *   - stage type (reception, nikah, sangeet, church, royal, engagement)
 *
 * to a REAL, DEDUPLICATED path from /public/assets/
 */

export type BudgetTier = "budget" | "mid" | "premium";
export type Religion = "hindu" | "muslim" | "christian" | "sikh" | "south";

// ─── Helper ───────────────────────────────────────────────────────────────────
function ext(path: string, format?: string): string {
  return path;
}

// ─── DECOR IMAGES ─────────────────────────────────────────────────────────────
// Available: haldi, mehndi, nikah, reception, sangeet, temple, wedding
export const DECOR_MAP: Record<string, Record<BudgetTier, string>> = {
  haldi: {
    budget: ext("/assets/decor/haldi/budget"),
    mid: ext("/assets/decor/haldi/mid"),
    premium: ext("/assets/decor/haldi/premium"),
  },
  mehndi: {
    budget: ext("/assets/decor/mehndi/budget"),
    mid: ext("/assets/decor/mehndi/mid"),
    premium: ext("/assets/decor/mehndi/mid"),
  },
  nikah: {
    budget: ext("/assets/decor/nikah/budget"),
    mid: ext("/assets/decor/nikah/mid"),
    premium: ext("/assets/decor/nikah/premium"),
  },
  reception: {
    budget: ext("/assets/decor/reception/budget"),
    mid: ext("/assets/decor/reception/mid"),
    premium: ext("/assets/decor/reception/premium"),
  },
  sangeet: {
    budget: ext("/assets/decor/sangeet/budget"),
    mid: ext("/assets/decor/sangeet/mid"),
    premium: ext("/assets/decor/sangeet/premium"),
  },
  temple: {
    budget: ext("/assets/decor/temple/budget"),
    mid: ext("/assets/decor/temple/mid"),
    premium: ext("/assets/decor/temple/premium"),
  },
  wedding: {
    budget: ext("/assets/decor/wedding/budget"),
    mid: ext("/assets/decor/wedding/mid"),
    premium: ext("/assets/decor/wedding/premium"),
  },
};

// ─── MANDAP IMAGES ────────────────────────────────────────────────────────────
// Available: beach, floral, luxury, minimal, royal, temple, traditional
export const MANDAP_MAP: Record<string, Record<BudgetTier, string>> = {
  beach: {
    budget: ext("/assets/mandap/beach/budget"),
    mid: ext("/assets/mandap/beach/mid"),
    premium: ext("/assets/mandap/beach/premium"),
  },
  floral: {
    budget: ext("/assets/mandap/floral/budget"),
    mid: ext("/assets/mandap/floral/mid"),
    premium: ext("/assets/mandap/floral/premium"),
  },
  luxury: {
    budget: ext("/assets/mandap/luxury/budget"),
    mid: ext("/assets/mandap/luxury/mid"),
    premium: ext("/assets/mandap/luxury/premium", "avif"),
  },
  minimal: {
    budget: ext("/assets/mandap/minimal/budget"),
    mid: ext("/assets/mandap/minimal/mid"),
    premium: ext("/assets/mandap/minimal/premium"),
  },
  royal: {
    budget: ext("/assets/mandap/royal/budget"),
    mid: ext("/assets/mandap/royal/mid"),
    premium: ext("/assets/mandap/royal/premium"),
  },
  temple: {
    budget: ext("/assets/mandap/temple/budget"),
    mid: ext("/assets/mandap/temple/mid", "avif"),
    premium: ext("/assets/mandap/temple/premium", "avif"),
  },
  traditional: {
    budget: ext("/assets/mandap/traditional/budget"),
    mid: ext("/assets/mandap/traditional/mid"),
    premium: ext("/assets/mandap/traditional/premium"),
  },
};

// ─── STAGE IMAGES ─────────────────────────────────────────────────────────────
// Available: church, engagement, nikah, reception, royal, sangeet
export const STAGE_MAP: Record<string, Record<BudgetTier, string>> = {
  church: {
    budget: ext("/assets/stage/church/budget"),
    mid: ext("/assets/stage/church/mid"),
    premium: ext("/assets/stage/church/premium"),
  },
  engagement: {
    budget: ext("/assets/stage/engagement/budget"),
    mid: ext("/assets/stage/engagement/mid"),
    premium: ext("/assets/stage/engagement/premium", "avif"),
  },
  nikah: {
    budget: ext("/assets/stage/nikah/budget"),
    mid: ext("/assets/stage/nikah/mid"),
    premium: ext("/assets/stage/nikah/premium"),
  },
  reception: {
    budget: ext("/assets/stage/reception/budget"),
    mid: ext("/assets/stage/reception/mid"),
    premium: ext("/assets/stage/reception/premium"),
  },
  royal: {
    budget: ext("/assets/stage/royal/budget"),
    mid: ext("/assets/stage/royal/mid"),
    premium: ext("/assets/stage/royal/premium", "avif"),
  },
  sangeet: {
    budget: ext("/assets/stage/sangeet/budget"),
    mid: ext("/assets/stage/sangeet/mid"),
    premium: ext("/assets/stage/sangeet/premium"),
  },
};

// ─── OUTFIT IMAGES ────────────────────────────────────────────────────────────
// Bride: bridal-gown, lehenga, saree, sharara
// Groom: indo-western, kurta, sherwani, tuxedo
// Couple: luxury, matching, pastel, royal
export const OUTFIT_MAP = {
  bride: {
    "bridal-gown": {
      budget: ext("/assets/outfits/bride/bridal-gown/budget"),
      mid: ext("/assets/outfits/bride/bridal-gown/mid"),
      premium: ext("/assets/outfits/bride/bridal-gown/premium"),
    },
    lehenga: {
      budget: ext("/assets/outfits/bride/lehenga/budget"),
      mid: ext("/assets/outfits/bride/lehenga/mid"),
      premium: ext("/assets/outfits/bride/lehenga/premium"),
    },
    saree: {
      budget: ext("/assets/outfits/bride/saree/budget"),
      mid: ext("/assets/outfits/bride/saree/mid"),
      premium: ext("/assets/outfits/bride/saree/premium"),
    },
    sharara: {
      budget: ext("/assets/outfits/bride/sharara/budget"),
      mid: ext("/assets/outfits/bride/sharara/mid"),
      premium: ext("/assets/outfits/bride/sharara/premium"),
    },
  },
  groom: {
    "indo-western": {
      budget: ext("/assets/outfits/groom/indo-western/budget"),
      mid: ext("/assets/outfits/groom/indo-western/mid"),
      premium: ext("/assets/outfits/groom/indo-western/premium"),
    },
    kurta: {
      budget: ext("/assets/outfits/groom/kurta/budget"),
      mid: ext("/assets/outfits/groom/kurta/mid"),
      premium: ext("/assets/outfits/groom/kurta/premium"),
    },
    sherwani: {
      budget: ext("/assets/outfits/groom/sherwani/budget"),
      mid: ext("/assets/outfits/groom/sherwani/mid"),
      premium: ext("/assets/outfits/groom/sherwani/premium"),
    },
    tuxedo: {
      budget: ext("/assets/outfits/groom/tuxedo/budget"),
      mid: ext("/assets/outfits/groom/tuxedo/mid"),
      premium: ext("/assets/outfits/groom/tuxedo/premium"),
    },
  },
  couple: {
    luxury: {
      budget: ext("/assets/outfits/couple/luxury/budget"),
      mid: ext("/assets/outfits/couple/luxury/mid"),
      premium: ext("/assets/outfits/couple/luxury/premium"),
    },
    matching: {
      budget: ext("/assets/outfits/couple/matching/budget"),
      mid: ext("/assets/outfits/couple/matching/mid"),
      premium: ext("/assets/outfits/couple/matching/premium"),
    },
    pastel: {
      budget: ext("/assets/outfits/couple/pastel/budget"),
      mid: ext("/assets/outfits/couple/pastel/mid"),
      premium: ext("/assets/outfits/couple/pastel/premium", "avif"),
    },
    royal: {
      budget: ext("/assets/outfits/couple/royal/budget"),
      mid: ext("/assets/outfits/couple/royal/mid"),
      premium: ext("/assets/outfits/couple/royal/premium"),
    },
  },
};

// ─── VENUE IMAGES ─────────────────────────────────────────────────────────────
export const VENUE_MAP: Record<
  string,
  Partial<Record<BudgetTier, { name: string; slug: string; ext: "webp" | "avif" }[]>>
> = {
  rajasthan: {
    budget: [{ name: "Sakura Garden Hall", slug: "sakura-garden-hall", ext: "avif" }],
    mid: [{ name: "Amber Palace Banquet", slug: "amber-palace-banquet", ext: "avif" }],
    premium: [],
  },
  goa: {
    budget: [{ name: "Local Community Pavilion", slug: "local-community-pavilion", ext: "webp" }],
    mid: [
      { name: "Mango Orchard Banquet", slug: "mango-orchard-banquet", ext: "avif" },
      { name: "Riverside Garden Venue", slug: "riverside-garden-venue", ext: "webp" },
    ],
    premium: [{ name: "Taj Holiday Village", slug: "taj-holiday-village", ext: "webp" }],
  },
  kerala: {
    budget: [],
    mid: [
      { name: "Coconut Grove Venue", slug: "coconut-grove-venue", ext: "avif" },
      { name: "Lagoon View Garden Resort", slug: "lagoon-view-garden-resort", ext: "avif" },
    ],
    premium: [{ name: "Spice Garden Palace", slug: "spice-garden-palace", ext: "webp" }],
  },
  karnataka: {
    budget: [{ name: "School Grounds Venue", slug: "school-grounds-venue", ext: "avif" }],
    mid: [
      { name: "Garden City Resort", slug: "garden-city-resort", ext: "webp" },
      { name: "Plantation Bungalow Venue", slug: "plantation-bungalow-venue", ext: "webp" },
      { name: "Waterfall Banquet Hall", slug: "waterfall-banquet-hall", ext: "webp" },
    ],
    premium: [],
  },
  hyderabad: {
    budget: [{ name: "Community Center Hall", slug: "community-center-hall", ext: "webp" }],
    mid: [{ name: "Garden Valley Venue", slug: "garden-valley-venue", ext: "avif" }],
    premium: [{ name: "Hyderabad Grand Palace", slug: "hyderabad-grand-palace", ext: "avif" }],
  },
  delhi: {
    budget: [{ name: "Community Hall Central", slug: "community-hall-central", ext: "avif" }],
    mid: [{ name: "Modern City Banquet", slug: "modern-city-banquet", ext: "avif" }],
    premium: [],
  },
  punjab: {
    budget: [
      { name: "Agricultural Field Ground", slug: "agricultural-field-ground", ext: "avif" },
      { name: "Community Hall Junction", slug: "community-hall-junction", ext: "avif" },
      { name: "Village Baithak Space", slug: "village-baithak-space", ext: "avif" },
    ],
    mid: [],
    premium: [{ name: "Jailandhar Garden Estate", slug: "jailandhar-garden-estate", ext: "avif" }],
  },
  maharashtra: {
    budget: [
      { name: "Local Community Hall", slug: "local-community-hall", ext: "avif" },
      { name: "Open Maidan Ground", slug: "open-maidan-ground", ext: "avif" },
    ],
    mid: [],
    premium: [],
  },
  "tamil-nadu": {
    budget: [
      { name: "Local Hall Community Space", slug: "local-hall-community-space", ext: "avif" },
      { name: "Rice Field Open Ground", slug: "rice-field-open-ground", ext: "webp" },
    ],
    mid: [],
    premium: [{ name: "Ooty Hill Palace Resort", slug: "ooty-hill-palace-resort", ext: "avif" }],
  },
};

// ─── RELIGION → EVENT → IMAGE MAPPING ────────────────────────────────────────
export interface EventImageProfile {
  decorKey: string;
  mandapKey: string;
  stageKey: string;
}

export const RELIGION_EVENT_MAP: Record<Religion, Record<string, EventImageProfile>> = {
  hindu: {
    Roka: { decorKey: "wedding", mandapKey: "floral", stageKey: "engagement" },
    Haldi: { decorKey: "haldi", mandapKey: "minimal", stageKey: "sangeet" },
    Mehndi: { decorKey: "mehndi", mandapKey: "traditional", stageKey: "sangeet" },
    Sangeet: { decorKey: "sangeet", mandapKey: "luxury", stageKey: "sangeet" },
    Wedding: { decorKey: "wedding", mandapKey: "royal", stageKey: "royal" },
    Reception: { decorKey: "reception", mandapKey: "floral", stageKey: "reception" },
  },
  muslim: {
    Mehndi: { decorKey: "mehndi", mandapKey: "traditional", stageKey: "nikah" },
    Nikah: { decorKey: "nikah", mandapKey: "luxury", stageKey: "nikah" },
    Walima: { decorKey: "reception", mandapKey: "royal", stageKey: "reception" },
  },
  christian: {
    Engagement: { decorKey: "wedding", mandapKey: "minimal", stageKey: "engagement" },
    "Church Wedding": { decorKey: "temple", mandapKey: "minimal", stageKey: "church" },
    Reception: { decorKey: "reception", mandapKey: "floral", stageKey: "reception" },
  },
  sikh: {
    Maiyan: { decorKey: "haldi", mandapKey: "traditional", stageKey: "sangeet" },
    "Anand Karaj": { decorKey: "temple", mandapKey: "temple", stageKey: "royal" },
    Reception: { decorKey: "reception", mandapKey: "floral", stageKey: "reception" },
  },
  south: {
    Muhurtham: { decorKey: "temple", mandapKey: "temple", stageKey: "royal" },
    Reception: { decorKey: "reception", mandapKey: "traditional", stageKey: "reception" },
  },
};

// ─── RELIGION → OUTFIT DEFAULTS ───────────────────────────────────────────────
export const RELIGION_OUTFIT_MAP: Record<
  Religion,
  { brideType: string; groomType: string; coupleType: string }
> = {
  hindu: { brideType: "lehenga", groomType: "sherwani", coupleType: "royal" },
  muslim: { brideType: "sharara", groomType: "sherwani", coupleType: "matching" },
  christian: { brideType: "bridal-gown", groomType: "tuxedo", coupleType: "luxury" },
  sikh: { brideType: "lehenga", groomType: "sherwani", coupleType: "pastel" },
  south: { brideType: "saree", groomType: "kurta", coupleType: "matching" },
};

// ─── RELIGION → MANDAP DEFAULT ────────────────────────────────────────────────
export const RELIGION_MANDAP_MAP: Record<Religion, string> = {
  hindu: "royal",
  muslim: "luxury",
  christian: "minimal",
  sikh: "traditional",
  south: "temple",
};

// ─── DECOR GALLERY PER RELIGION ───────────────────────────────────────────────
// Returns a deduplicated set of decor images relevant to a religion & budget
export function getDecorGallery(religion: Religion, tier: BudgetTier): string[] {
  const eventMap = RELIGION_EVENT_MAP[religion] || RELIGION_EVENT_MAP.hindu;
  const seen = new Set<string>();
  const images: string[] = [];

  Object.values(eventMap).forEach(({ decorKey }) => {
    const img = DECOR_MAP[decorKey]?.[tier];
    if (img && !seen.has(img)) {
      seen.add(img);
      images.push(img);
    }
  });

  // Also add mandap & stage variety
  const mandapKey = RELIGION_MANDAP_MAP[religion] || "royal";
  const mandapImg = MANDAP_MAP[mandapKey]?.[tier];
  if (mandapImg && !seen.has(mandapImg)) {
    seen.add(mandapImg);
    images.push(mandapImg);
  }

  // Add reception stage always
  const recImg = STAGE_MAP["reception"]?.[tier];
  if (recImg && !seen.has(recImg)) {
    seen.add(recImg);
    images.push(recImg);
  }

  return images;
}

// ─── VENUE RESOLVER ───────────────────────────────────────────────────────────
export interface VenueResult {
  name: string;
  image: string;
  state: string;
  tier: BudgetTier;
  capacity: number;
  priceRange: string;
  description: string;
  styles: string[];
  rating: number;
}

const FALLBACK_VENUES: Record<BudgetTier, Omit<VenueResult, "state" | "image">> = {
  budget: {
    name: "Grand Community Hall",
    tier: "budget",
    capacity: 300,
    priceRange: "₹50,000 – ₹1.5 Lakh",
    description: "A spacious, affordable venue for a heartfelt celebration.",
    styles: ["Traditional", "Simple"],
    rating: 4.0,
  },
  mid: {
    name: "Elegant Banquet Hall",
    tier: "mid",
    capacity: 500,
    priceRange: "₹2 Lakh – ₹8 Lakh",
    description: "A premium banquet hall with tasteful décor and modern amenities.",
    styles: ["Royal", "Modern"],
    rating: 4.3,
  },
  premium: {
    name: "Royal Heritage Palace",
    tier: "premium",
    capacity: 1000,
    priceRange: "₹15 Lakh+",
    description: "A breathtaking palatial estate for a legendary wedding day.",
    styles: ["Royal", "Luxury", "Destination"],
    rating: 4.9,
  },
};

const PRICE_RANGES: Record<BudgetTier, string> = {
  budget: "₹50,000 – ₹2 Lakh",
  mid: "₹3 Lakh – ₹10 Lakh",
  premium: "₹15 Lakh – ₹50 Lakh+",
};

const CAPACITY: Record<BudgetTier, number> = { budget: 250, mid: 500, premium: 1000 };
const RATINGS: Record<BudgetTier, number> = { budget: 4.0, mid: 4.3, premium: 4.8 };

function normalizeState(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace("tamilnadu", "tamil-nadu")
    .replace("andhra pradesh", "hyderabad")
    .replace("telangana", "hyderabad");
}

export function getVenuesByStateAndTier(state: string, tier: BudgetTier): VenueResult[] {
  const key = normalizeState(state);
  const list = VENUE_MAP[key]?.[tier] ?? [];

  if (list.length > 0) {
    return list.map((v) => ({
      name: v.name,
      image: `/assets/venues/${key}/${tier}/${v.slug}`,
      state: state,
      tier,
      capacity: CAPACITY[tier],
      priceRange: PRICE_RANGES[tier],
      description: `A beautiful ${tier} venue in ${state} perfect for an unforgettable ${tier === "premium" ? "luxury" : tier} wedding experience.`,
      styles:
        tier === "premium"
          ? ["Luxury", "Royal", "Destination"]
          : tier === "mid"
            ? ["Modern", "Royal"]
            : ["Traditional", "Simple"],
      rating: RATINGS[tier],
    }));
  }

  // Fallback — try adjacent tier
  const adjacent = tier === "premium" ? "mid" : tier === "budget" ? "mid" : "budget";
  const adjList = VENUE_MAP[key]?.[adjacent] ?? [];
  if (adjList.length > 0) {
    return adjList.slice(0, 1).map((v) => ({
      name: v.name,
      image: `/assets/venues/${key}/${adjacent}/${v.slug}`,
      state: state,
      tier,
      capacity: CAPACITY[tier],
      priceRange: PRICE_RANGES[tier],
      description: `A beautiful venue in ${state} for your ${tier} wedding celebration.`,
      styles: ["Royal", "Traditional"],
      rating: RATINGS[tier],
    }));
  }

  // Global fallback — use a known working state
  const fallbackState = tier === "premium" ? "goa" : tier === "budget" ? "punjab" : "karnataka";
  const fbList = VENUE_MAP[fallbackState]?.[tier] ?? VENUE_MAP[fallbackState]?.["mid"] ?? [];
  if (fbList.length > 0) {
    const v = fbList[0];
    const usedTier = VENUE_MAP[fallbackState]?.[tier]?.length ? tier : "mid";
    return [
      {
        name: v.name,
        image: `/assets/venues/${fallbackState}/${usedTier}/${v.slug}`,
        state: state,
        tier,
        capacity: CAPACITY[tier],
        priceRange: PRICE_RANGES[tier],
        description: `A handpicked ${tier} venue selected for your wedding celebration.`,
        styles: ["Royal", "Traditional"],
        rating: RATINGS[tier],
      },
    ];
  }

  return [{ ...FALLBACK_VENUES[tier], state, image: "/assets/fallback/cover.webp" }];
}

// ─── OUTFIT RESOLVER ─────────────────────────────────────────────────────────
export interface OutfitResult {
  bride: { type: string; image: string; description: string; accessories: string[] };
  groom: { type: string; image: string; description: string; accessories: string[] };
  couple: { style: string; image: string };
}

const BRIDE_DESCRIPTIONS: Record<string, Record<BudgetTier, string>> = {
  lehenga: {
    budget: "A vibrant silk lehenga with traditional embroidery.",
    mid: "A designer lehenga with intricate zari and mirror work.",
    premium: "A couture lehenga with heavy hand-embroidered motifs and silk lining.",
  },
  saree: {
    budget: "A classic Kanjeevaram saree in rich jewel tones.",
    mid: "A Banarasi silk saree with gold zari weave.",
    premium: "A pure heritage Kanjeevaram with 22-karat gold thread detailing.",
  },
  sharara: {
    budget: "A graceful sharara set with light thread work.",
    mid: "A designer sharara with pearl and crystal embellishments.",
    premium: "A luxury sharara in georgette with hand-stitched sequin patterns.",
  },
  "bridal-gown": {
    budget: "A classic white bridal gown with lace trim.",
    mid: "An A-line bridal gown with tulle skirt and crystal bodice.",
    premium: "A bespoke couture gown with cathedral train and handcrafted lace.",
  },
};

const GROOM_DESCRIPTIONS: Record<string, Record<BudgetTier, string>> = {
  sherwani: {
    budget: "A classic sherwani in ivory or cream with minimal embroidery.",
    mid: "A designer sherwani with rich brocade and gold zari work.",
    premium: "A royal sherwani in pure silk with elaborate hand-embroidery.",
  },
  kurta: {
    budget: "A simple kurta-pyjama set in pastel shades.",
    mid: "A premium kurta with intricate block prints.",
    premium: "A luxury kurta set with gold thread and artisanal weaving.",
  },
  "indo-western": {
    budget: "A smart indo-western set with a Nehru jacket.",
    mid: "A tailored indo-western suit with metallic finishes.",
    premium: "A bespoke fusion ensemble blending Jodhpuri cut with luxury Italian fabrics.",
  },
  tuxedo: {
    budget: "A classic black tuxedo with bow-tie.",
    mid: "A slim-fit tuxedo in charcoal with satin lapels.",
    premium: "A made-to-measure tuxedo in midnight black with gold cufflinks.",
  },
};

const BRIDE_ACCESSORIES: Record<string, Record<BudgetTier, string[]>> = {
  lehenga: {
    budget: ["Kundan Set", "Maang Tikka", "Bangles"],
    mid: ["Polki Set", "Statement Necklace", "Gold Jhumkas"],
    premium: ["Uncut Diamond Set", "Royal Rani Haar", "Gold Bangles & Kada"],
  },
  saree: {
    budget: ["Temple Jewellery", "Gold Bangles", "Silk Blouse"],
    mid: ["Antique Gold Set", "Pearl Earrings", "Zari Blouse"],
    premium: ["Jadau Jewellery", "Heritage Necklace", "Woven Silk Blouse"],
  },
  sharara: {
    budget: ["Silver Jhumkas", "Choker Set", "Bangles"],
    mid: ["Meenakari Set", "Chandbali Earrings", "Crystal Bangles"],
    premium: ["Polki Choker", "Kundan Maang Tikka", "Diamond Drops"],
  },
  "bridal-gown": {
    budget: ["Pearl Earrings", "Simple Tiara", "White Heels"],
    mid: ["Crystal Earrings", "Pearl Necklace", "Satin Heels"],
    premium: ["Diamond Earrings", "Swarovski Tiara", "Embellished Heels"],
  },
};

const GROOM_ACCESSORIES: Record<string, string[]> = {
  sherwani: ["Safa / Pagri", "Royal Brooch", "Mojri / Juttis", "Kalgi"],
  kurta: ["Pashmina Dupatta", "Kolhapuri Chappals", "Pocket Square"],
  "indo-western": ["Cufflinks", "Formal Shoes", "Pocket Square", "Lapel Pin"],
  tuxedo: ["Bow Tie", "Gold Cufflinks", "Oxford Shoes", "Pocket Square"],
};

export function getOutfitsByReligionAndTier(religion: Religion, tier: BudgetTier): OutfitResult {
  const { brideType, groomType, coupleType } =
    RELIGION_OUTFIT_MAP[religion] || RELIGION_OUTFIT_MAP.hindu;

  return {
    bride: {
      type: brideType,
      image:
        OUTFIT_MAP.bride[brideType as keyof typeof OUTFIT_MAP.bride]?.[tier] ??
        "/assets/outfits/bride/lehenga/premium",
      description:
        BRIDE_DESCRIPTIONS[brideType]?.[tier] ?? "A beautifully crafted bridal ensemble.",
      accessories: BRIDE_ACCESSORIES[brideType]?.[tier] ?? ["Traditional Jewellery"],
    },
    groom: {
      type: groomType,
      image:
        OUTFIT_MAP.groom[groomType as keyof typeof OUTFIT_MAP.groom]?.[tier] ??
        "/assets/outfits/groom/sherwani/premium",
      description: GROOM_DESCRIPTIONS[groomType]?.[tier] ?? "A regal groom ensemble.",
      accessories: GROOM_ACCESSORIES[groomType] ?? ["Classic Accessories"],
    },
    couple: {
      style: coupleType,
      image:
        OUTFIT_MAP.couple[coupleType as keyof typeof OUTFIT_MAP.couple]?.[tier] ??
        "/assets/outfits/couple/royal/premium",
    },
  };
}

// ─── EVENT BUILDER ────────────────────────────────────────────────────────────
export interface EventPlan {
  name: string;
  day: number;
  time: string;
  description: string;
  decorImage: string;
  mandapImage: string;
  stageImage: string;
  theme: string;
  budget: number;
}

const EVENT_DESCRIPTIONS: Record<string, Record<BudgetTier, string>> = {
  Haldi: {
    budget: "A joyful haldi ceremony with marigold garlands and turmeric rituals.",
    mid: "An elegant haldi function with curated yellow florals and matching outfits.",
    premium:
      "A cinematic haldi with drone coverage, luxury floral arches, and personalized rituals.",
  },
  Mehndi: {
    budget: "An intimate mehndi with boho vibes and handcrafted henna designs.",
    mid: "A styled mehndi function with floral backdrops and folk music performances.",
    premium: "A luxury mehndi with master henna artists, LED setup, and bespoke outfits.",
  },
  Sangeet: {
    budget: "A fun sangeet night with DJ and coordinated group performances.",
    mid: "A themed sangeet with LED dance floor, live music, and colour-pop lighting.",
    premium: "A Bollywood-style sangeet with live band, celebrity choreography, and pyrotechnics.",
  },
  Nikah: {
    budget: "A sacred nikah ceremony with elegant white and emerald décor.",
    mid: "A premium nikah with crystal chandeliers and calligraphy arch backdrop.",
    premium: "A royal nikah in a palace venue with imported floral installation and live nasheeds.",
  },
  Walima: {
    budget: "A traditional walima feast with warm family gathering.",
    mid: "An elevated walima with banquet hall and curated menu.",
    premium: "A grand walima reception in a 5-star ballroom with chef-curated Nawabi spread.",
  },
  "Anand Karaj": {
    budget: "A blessed Anand Karaj at the gurudwara with traditional ceremonies.",
    mid: "An elegant Anand Karaj with phulkari décor and live shabad kirtan.",
    premium: "A royal Anand Karaj with luxury venue, drone coverage, and heritage decorations.",
  },
  "Church Wedding": {
    budget: "A beautiful church ceremony with classic white florals.",
    mid: "An elegant church wedding with floral aisle runners and cathedral décor.",
    premium:
      "A grand church wedding with professional choir, floral installations, and cinematic coverage.",
  },
  Muhurtham: {
    budget: "A sacred muhurtham ceremony with jasmine garlands and brass lamps.",
    mid: "A curated muhurtham with authentic temple flowers and Nadaswaram music.",
    premium:
      "A grand muhurtham with heritage temple venue, premium jasmine décor, and silk attire.",
  },
  Maiyan: {
    budget: "A simple maiyan with turmeric and traditional folk songs.",
    mid: "A styled maiyan with pastel florals and coordinated family attire.",
    premium: "A luxury maiyan with floral installations and premium catering.",
  },
  Wedding: {
    budget: "A heartfelt wedding mandap ceremony with traditional rituals.",
    mid: "An elegant wedding with custom floral mandap and professional photography.",
    premium: "A cinematic luxury wedding with royal mandap, helicopter entry, and 5-star catering.",
  },
  Reception: {
    budget: "A warm reception with friends and family in a decorated hall.",
    mid: "A stylish reception with elegant stage setup and DJ night.",
    premium: "A grand ballroom reception with celebrity entertainment and premium photo booth.",
  },
  Roka: {
    budget: "A simple roka ceremony with family blessings and sweets.",
    mid: "An elegant roka with floral stage and professional photographer.",
    premium: "A luxury roka in a premium venue with designer outfits and fine dining.",
  },
  Engagement: {
    budget: "A heartfelt engagement with closest family members.",
    mid: "A styled engagement with floral backdrop and professional coverage.",
    premium: "A luxury engagement ceremony with designer rings and 5-star venue.",
  },
};

const EVENT_TIMES: Record<string, string> = {
  Haldi: "9:00 AM",
  Mehndi: "3:00 PM",
  Sangeet: "7:00 PM",
  Nikah: "11:00 AM",
  Walima: "7:00 PM",
  "Anand Karaj": "9:00 AM",
  "Church Wedding": "11:00 AM",
  Muhurtham: "8:30 AM",
  Maiyan: "10:00 AM",
  Wedding: "11:00 AM",
  Reception: "7:00 PM",
  Roka: "11:00 AM",
  Engagement: "6:00 PM",
};

export function buildEventPlan(
  eventName: string,
  religion: Religion,
  tier: BudgetTier,
  dayIndex: number,
  totalBudget: number,
  eventCount: number,
): EventPlan {
  const profile = RELIGION_EVENT_MAP[religion]?.[eventName] || {
    decorKey: "wedding",
    mandapKey: RELIGION_MANDAP_MAP[religion] || "royal",
    stageKey: "royal",
  };

  return {
    name: eventName,
    day: dayIndex + 1,
    time: EVENT_TIMES[eventName] ?? "6:00 PM",
    description:
      EVENT_DESCRIPTIONS[eventName]?.[tier] ??
      `A beautiful ${eventName} ceremony crafted for your special day.`,
    decorImage: DECOR_MAP[profile.decorKey]?.[tier] ?? "/assets/fallback/cover.webp",
    mandapImage: MANDAP_MAP[profile.mandapKey]?.[tier] ?? "/assets/fallback/cover.webp",
    stageImage: STAGE_MAP[profile.stageKey]?.[tier] ?? "/assets/fallback/cover.webp",
    theme: profile.mandapKey,
    budget: Math.round(totalBudget / eventCount),
  };
}

// ─── RELIGION EVENT LIST ─────────────────────────────────────────────────────
export const RELIGION_EVENTS: Record<Religion, string[]> = {
  hindu: ["Roka", "Haldi", "Mehndi", "Sangeet", "Wedding", "Reception"],
  muslim: ["Mehndi", "Nikah", "Walima"],
  christian: ["Engagement", "Church Wedding", "Reception"],
  sikh: ["Maiyan", "Anand Karaj", "Reception"],
  south: ["Muhurtham", "Reception"],
};

// ─── BUDGET BREAKDOWN ─────────────────────────────────────────────────────────
export interface BudgetLine {
  category: string;
  pct: number;
  amount: number;
}

export function computeBudgetBreakdown(
  total: number,
  tier: BudgetTier,
  religion: Religion,
): BudgetLine[] {
  let allocations: Record<string, number>;

  if (tier === "budget") {
    allocations = {
      Venue: 35,
      Catering: 28,
      Decor: 12,
      Photography: 8,
      Outfits: 10,
      Entertainment: 3,
      Miscellaneous: 4,
    };
  } else if (tier === "mid") {
    allocations = {
      Venue: 30,
      Catering: 24,
      Decor: 18,
      Photography: 10,
      Outfits: 10,
      Entertainment: 5,
      Miscellaneous: 3,
    };
  } else {
    allocations = {
      Venue: 28,
      Catering: 20,
      Decor: 20,
      Photography: 12,
      Outfits: 8,
      Entertainment: 8,
      Miscellaneous: 4,
    };
  }

  // Religion adjustments
  if (religion === "south") {
    allocations["Catering"] += 3;
    allocations["Decor"] -= 3;
  } else if (religion === "muslim") {
    allocations["Catering"] += 2;
    allocations["Outfits"] -= 2;
  } else if (religion === "christian") {
    allocations["Photography"] += 2;
    allocations["Entertainment"] -= 2;
  }

  return Object.entries(allocations).map(([category, pct]) => ({
    category,
    pct,
    amount: Math.round((total * pct) / 100),
  }));
}

// ─── MASTER PLAN BUILDER ─────────────────────────────────────────────────────
export interface WeddingPlan {
  religion: Religion;
  tier: BudgetTier;
  state: string;
  totalBudget: number;
  guests: number;
  theme: string;
  events: EventPlan[];
  venues: VenueResult[];
  outfits: OutfitResult;
  decorGallery: string[];
  budgetBreakdown: BudgetLine[];
}

export function buildWeddingPlan(
  religion: string,
  state: string,
  budget: number,
  guests: number,
  theme: string,
): WeddingPlan {
  const rel = (religion || "hindu").toLowerCase().replace(/[\s_-]+/g, "") as Religion;
  const normalizedRel: Religion = rel.includes("south")
    ? "south"
    : rel.includes("muslim")
      ? "muslim"
      : rel.includes("christian")
        ? "christian"
        : rel.includes("sikh")
          ? "sikh"
          : "hindu";

  const tier: BudgetTier = budget < 600000 ? "budget" : budget < 2000000 ? "mid" : "premium";

  const eventNames = RELIGION_EVENTS[normalizedRel];
  const events = eventNames.map((name, i) =>
    buildEventPlan(name, normalizedRel, tier, i, budget, eventNames.length),
  );

  const venues = getVenuesByStateAndTier(state, tier);

  const outfits = getOutfitsByReligionAndTier(normalizedRel, tier);
  const decorGallery = getDecorGallery(normalizedRel, tier);
  const budgetBreakdown = computeBudgetBreakdown(budget, tier, normalizedRel);

  return {
    religion: normalizedRel,
    tier,
    state,
    totalBudget: budget,
    guests,
    theme,
    events,
    venues,
    outfits,
    decorGallery,
    budgetBreakdown,
  };
}
