/**
 * services/eventFlow.service.js
 *
 * Multi-religion intelligent wedding event flow engine.
 * Handles: event ordering, timing, venue type, outfit, decor, and images.
 */

const { religiousEvents } = require("../data/weddingData");
const imageEngine = require("../utils/imageEngine");

// ─── 1. Get ordered event flow for a religion ─────────────────────────────────
function getEventFlow(religion) {
  const key = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  return religiousEvents[key] || religiousEvents["default"] || religiousEvents["hindu"];
}

// ─── 2. Budget distribution ───────────────────────────────────────────────────
function distributeEventBudget(totalBudget, events) {
  const budget = Math.max(Number(totalBudget) || 500000, 150000);

  const enriched = events.map((evt) => {
    const pct = evt.budgetPercent || 5;
    return { ...evt, eventBudget: Math.round(budget * (pct / 100)) };
  });

  return {
    events: enriched,
    budgetBreakdown: {
      total: budget,
      tier: budget < 500000 ? "budget" : budget < 1500000 ? "mid" : "premium",
      preEvents: { label: "Pre-Wedding Events", amount: Math.round(budget * 0.2), pct: 20 },
      wedding: { label: "Wedding Ceremony", amount: Math.round(budget * 0.4), pct: 40 },
      reception: { label: "Reception", amount: Math.round(budget * 0.25), pct: 25 },
      misc: { label: "Miscellaneous", amount: Math.round(budget * 0.15), pct: 15 },
      categories: {
        venue: { percentage: 40, value: Math.round(budget * 0.4) },
        catering: { percentage: 25, value: Math.round(budget * 0.25) },
        decor: { percentage: 20, value: Math.round(budget * 0.2) },
        photography: { percentage: 10, value: Math.round(budget * 0.1) },
        misc: { percentage: 5, value: Math.round(budget * 0.05) },
      },
    },
  };
}

// ─── 3. Build full structured event objects ────────────────────────────────────
async function buildStructuredEvents({
  events,
  budget,
  religion,
  theme,
  venueName,
  location,
  sessionId = null,
}) {
  const rel = String(religion || "hindu")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  const thm = String(theme || "royal").toLowerCase();

  // Reset image memory at the start of each plan generation for this session
  if (sessionId) {
    await imageEngine.clearImageMemory(sessionId);
  }

  const { events: budgetedEvents } = distributeEventBudget(budget, events);

  const structured = await Promise.all(
    budgetedEvents.map(async (evt) => {
      // Religion + theme + event-aware images (await all)
      const decorImages = await imageEngine.getEventDecorImages(
        evt.name,
        rel,
        thm,
        budget,
        5,
        sessionId,
      );
      const brideOutfitImgs = await imageEngine.getBrideOutfitImages(rel, 3, sessionId);
      const groomOutfitImgs = await imageEngine.getGroomOutfitImages(rel, 3, sessionId);
      const foodImages = await imageEngine.getFoodPresentationImages(3, sessionId);
      const couplePoses = await imageEngine.getPhotographyIdeas(4, sessionId);
      const venueImgs = await imageEngine.getVenueImages(evt.venueType, 2, sessionId);
      const stageImgs = await imageEngine.getStageImages(2, sessionId);

      return {
        ...evt,
        images: decorImages,
        decorGallery: decorImages.slice(1),
        venueImages: venueImgs,
        stageInspiration: {
          images: stageImgs,
          theme: evt.decorTheme || "Royal Heritage",
        },
        outfit: {
          ...evt.outfit,
          brideImage: brideOutfitImgs[0],
          brideGallery: brideOutfitImgs,
          groomImage: groomOutfitImgs[0],
          groomGallery: groomOutfitImgs,
        },
        foodImages,
        photographyIdeas: couplePoses,
        checklist: evt.checklist || [],
        musicPlaylist: evt.musicPlaylist || [],
        entryIdeas: evt.entryIdeas || "",
        menuSuggestions: evt.menuSuggestions || [],
        photographyShotIdeas: evt.photographyIdeas || [],
      };
    }),
  );

  return structured;
}

// ─── 4. Build timeline from events ────────────────────────────────────────────
function buildTimeline(events) {
  const dayMap = {};
  events.forEach((evt) => {
    const d = evt.day;
    if (!dayMap[d]) dayMap[d] = [];
    dayMap[d].push(evt);
  });

  return Object.keys(dayMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((dayNum) => ({
      day: Number(dayNum),
      label: `Day ${dayNum}`,
      events: dayMap[dayNum],
    }));
}

module.exports = {
  getEventFlow,
  distributeEventBudget,
  buildStructuredEvents,
  buildTimeline,
};
