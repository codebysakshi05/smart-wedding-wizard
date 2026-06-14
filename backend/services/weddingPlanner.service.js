/**
 * services/weddingPlanner.service.js
 * Core business logic for full Indian wedding planning.
 */

const {
  religiousEvents,
  dressRecommendations,
  decorThemes,
  vendorSuggestions,
} = require("../data/weddingData");
const staticVenues = require("../data/venues");

// ─── Budget Engine ─────────────────────────────────────────────────────────────
/**
 * Distribute total budget across key wedding categories.
 * Minimum supported budget: ₹1,50,000
 */
function distributeBudget(totalBudget) {
  const budget = Math.max(Number(totalBudget), 150000);

  let distribution;

  if (budget < 500000) {
    // Budget tier: < 5 lakh
    distribution = {
      venue: Math.round(budget * 0.3),
      catering: Math.round(budget * 0.35),
      decor: Math.round(budget * 0.15),
      photography: Math.round(budget * 0.1),
      miscellaneous: Math.round(budget * 0.1),
    };
  } else if (budget < 1500000) {
    // Mid tier: 5 lakh – 15 lakh
    distribution = {
      venue: Math.round(budget * 0.35),
      catering: Math.round(budget * 0.3),
      decor: Math.round(budget * 0.18),
      photography: Math.round(budget * 0.12),
      miscellaneous: Math.round(budget * 0.05),
    };
  } else {
    // Premium tier: 15 lakh+
    distribution = {
      venue: Math.round(budget * 0.4),
      catering: Math.round(budget * 0.25),
      decor: Math.round(budget * 0.2),
      photography: Math.round(budget * 0.1),
      miscellaneous: Math.round(budget * 0.05),
    };
  }

  const tier = budget < 500000 ? "budget" : budget < 1500000 ? "mid" : "premium";

  return {
    total: budget,
    tier,
    breakdown: distribution,
    formatted: {
      total: formatINR(budget),
      venue: formatINR(distribution.venue),
      catering: formatINR(distribution.catering),
      decor: formatINR(distribution.decor),
      photography: formatINR(distribution.photography),
      miscellaneous: formatINR(distribution.miscellaneous),
    },
  };
}

function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

// ─── Religion-Based Events ─────────────────────────────────────────────────────
function getEvents(religion) {
  const key = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  return religiousEvents[key] || religiousEvents["hindu"];
}

// ─── Multi-Day Timeline ────────────────────────────────────────────────────────
function buildTimeline(events, weddingDate) {
  const baseDate = weddingDate ? new Date(weddingDate) : new Date();
  const dayMap = {};

  events.forEach((event) => {
    const day = event.day || 1;
    if (!dayMap[day]) dayMap[day] = [];
    dayMap[day].push(event);
  });

  const timeline = Object.keys(dayMap)
    .sort()
    .map((dayNum) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + (Number(dayNum) - 1));
      return {
        day: Number(dayNum),
        date: d.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        label: `Day ${dayNum} – ${getDayLabel(dayNum, Object.keys(dayMap).length)}`,
        events: dayMap[dayNum].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)),
      };
    });

  return timeline;
}

function getDayLabel(day, total) {
  if (total === 1) return "Wedding Day";
  if (day == 1) return "Pre-Wedding Celebrations";
  if (day == total) return "Post-Wedding";
  return "Wedding Day";
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

// ─── Dress Recommendations ────────────────────────────────────────────────────
function getDressRecommendations(religion, theme) {
  const religionKey = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  const themeKey = String(theme || "traditional")
    .toLowerCase()
    .replace(/\s+/g, "");

  const religiousDress = dressRecommendations[religionKey] || dressRecommendations["hindu"];

  // Try to find matching theme; fallback to 'traditional'
  const matchedTheme = religiousDress[themeKey] || religiousDress["traditional"];

  return {
    religion: religionKey,
    theme: themeKey,
    recommendations: matchedTheme,
    note: "Dress choices vary by region and family preference. These are curated suggestions.",
  };
}

// ─── Decor & Theme ────────────────────────────────────────────────────────────
function getDecorRecommendations(religion, venueType, budgetTier) {
  const rel = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  const vType = String(venueType || "resort").toLowerCase();
  const tier = String(budgetTier || "mid").toLowerCase();

  // Try to drill down: religion → venueType → budgetTier
  const byReligion = decorThemes[rel] || decorThemes["hindu"];
  const byVenue = byReligion[vType] || byReligion[Object.keys(byReligion)[0]];
  const byTier = byVenue[tier] || byVenue["mid"] || byVenue[Object.keys(byVenue)[0]];

  return {
    religion: rel,
    venueType: vType,
    budgetTier: tier,
    decor: byTier,
  };
}

// ─── Venue Recommendation ─────────────────────────────────────────────────────
function getVenueRecommendation(state, budgetTier, guests) {
  let filtered = staticVenues.filter(
    (v) => !state || v.state.toLowerCase() === String(state).toLowerCase(),
  );

  const stateFallback = [...filtered];

  if (guests) {
    filtered = filtered.filter((v) => v.capacity >= Number(guests));
  }
  if (budgetTier) {
    filtered = filtered.filter((v) => v.priceCategory === budgetTier);
  }

  if (filtered.length === 0) filtered = stateFallback;

  filtered.sort((a, b) => b.rating - a.rating);
  return filtered.slice(0, 3);
}

// ─── Vendor Suggestions ───────────────────────────────────────────────────────
function getVendorSuggestions(religion, budgetTier) {
  const rel = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  const caterers = vendorSuggestions.catering[rel] || vendorSuggestions.catering["hindu"];

  // Filter photography/decor by budget tier roughly
  const photographers = vendorSuggestions.photography.slice(0, budgetTier === "premium" ? 4 : 2);
  const decorVendors = vendorSuggestions.decor.slice(0, budgetTier === "premium" ? 3 : 2);
  const entertainment = vendorSuggestions.entertainment.slice(0, budgetTier === "budget" ? 1 : 3);
  const makeupArtists = vendorSuggestions.makeupArtist.slice(0, 2);

  return {
    catering: caterers,
    photography: photographers,
    decor: decorVendors,
    entertainment,
    makeupArtist: makeupArtists,
  };
}

const imageEngine = require("../utils/imageEngine");

// ─── Master Planner ───────────────────────────────────────────────────────────
/**
 * Generate a complete Indian wedding plan.
 */
async function generateWeddingPlan({
  budget,
  religion,
  guests,
  state,
  theme,
  weddingDate,
  sessionId = null,
}) {
  const budgetInfo = distributeBudget(budget);
  const events = getEvents(religion);
  const timeline = buildTimeline(events, weddingDate);
  const venues = getVenueRecommendation(state, budgetInfo.tier, guests);
  const primaryVenue = venues[0] || null;
  const decor = getDecorRecommendations(religion, primaryVenue?.type, budgetInfo.tier);
  const dress = getDressRecommendations(religion, theme);
  const vendors = getVendorSuggestions(religion, budgetInfo.tier);

  // ─── New Visual Injection Layer ───
  console.log(
    `[WeddingPlanner] Injecting metadata-driven visuals for ${religion} ${theme} wedding...`,
  );

  // 1. Inject event-specific galleries
  for (const event of events) {
    event.images = await imageEngine.getEventImages(
      event.name,
      religion,
      theme,
      budgetInfo.tier,
      6,
      sessionId || "default",
    );
    // Add metadata for frontend smart display
    event.metadata = { religion, theme, budget: budgetInfo.tier, event: event.name };
  }

  // 2. Inject outfit galleries
  const outfitsByEvent = await Promise.all(
    events.map(async (evt) => {
      const groomGallery = await imageEngine.getGroomOutfitImages(
        religion,
        theme,
        budgetInfo.tier,
        4,
        sessionId || "default",
      );
      const brideGallery = await imageEngine.getBrideOutfitImages(
        religion,
        theme,
        budgetInfo.tier,
        4,
        sessionId || "default",
      );
      return {
        event: evt.name,
        groom: evt.outfit?.groom || "Traditional Attire",
        bride: evt.outfit?.bride || "Bridal Attire",
        groomGallery,
        brideGallery,
        colorPalette: evt.outfit?.colorPalette || [],
      };
    }),
  );

  // 3. Inject planning vault visuals
  const invitationImages = await imageEngine.getInvitationImages(theme, 1, sessionId || "default");
  const honeymoonImages = await imageEngine.getHoneymoonImages(1, sessionId || "default");

  const planningVault = {
    invitations: {
      style: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Aesthetic`,
      image: invitationImages && invitationImages.length > 0 ? invitationImages[0] : null,
      tips: [
        "Send digital invites 4 months early",
        "Include RSVP QR code",
        "Map with landmark details",
      ],
    },
    honeymoon: {
      destination:
        budgetInfo.tier === "premium" ? "Maldives / Amalfi Coast" : "Goa / Kerala / Bali",
      vibe: "Romantic & Relaxed",
      image: honeymoonImages && honeymoonImages.length > 0 ? honeymoonImages[0] : null,
    },
    masterChecklist: [
      "Book main venue",
      "Finalize guest list",
      "Shop for bridal jewelry",
      "Book photographers",
      "Arrange transport for guests",
      "Setup gift registry",
    ],
  };

  return {
    summary: {
      religion: String(religion || "hindu"),
      guests: Number(guests) || 0,
      state: state || "Pan India",
      theme: theme || "traditional",
      weddingDate: weddingDate || null,
      totalDays: timeline.length,
      totalEvents: events.length,
      totalBudget: budgetInfo.total,
    },
    budget: budgetInfo,
    budgetBreakdown: {
      categories: {
        venue: { value: budgetInfo.breakdown.venue, percentage: 35 },
        catering: { value: budgetInfo.breakdown.catering, percentage: 30 },
        decor: { value: budgetInfo.breakdown.decor, percentage: 20 },
        photography: { value: budgetInfo.breakdown.photography, percentage: 10 },
        misc: { value: budgetInfo.breakdown.miscellaneous, percentage: 5 },
      },
    },
    events,
    timeline,
    venues, // Support for multiple venues
    primaryVenue,
    decor,
    dress,
    outfits: { byEvent: outfitsByEvent },
    vendors,
    planningVault,
  };
}

module.exports = {
  generateWeddingPlan,
  distributeBudget,
  getEvents,
  buildTimeline,
  getDressRecommendations,
  getDecorRecommendations,
  getVendorSuggestions,
};
