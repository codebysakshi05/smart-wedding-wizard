/**
 * lib/weddingLoader.ts
 * Smart dynamic loader for the results page.
 *
 * Priority:
 *  1. sessionStorage  (fastest — set by quiz submit)
 *  2. Backend GET /api/sample-plan  (demo mode)
 *  3. Dynamic local client-side generation from wedding-data JSON files
 */
import { getCuratedJourneyPlan } from "@/data/curatedJourneys";
import { getDecorImage, getOutfitImage, getVenueImage, getFallbackImage } from "@/utils/assets";
import { resolveGalleryByFolder } from "@/utils/imageGalleryResolver";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";

// ─── AppData Interface ────────────────────────────────────────────────────────
export interface AppData {
  venues: any[];
  events: any[];
  outfits: any;
  images: {
    venueImages: string[];
    decorImages: string[];
    ceremonyImages: string[];
    outfitImages: string[];
  };
  budgetBreakdown: any;
  summary: any;
  priorities?: string[];
  planningVault?: any;
  recommendations?: any;
  religion?: string;
  theme?: string;
  timeline?: any;
  isDemo: boolean;
}

const CACHE_VERSION = "v9-production-2026-05-21";

// ─── Image helpers (no imageEngine dependency) ────────────────────────────────
function getEventImageLocal(eventName: string, religion: string): string {
  const ev = (eventName || "").toLowerCase();
  const rel = (religion || "").toLowerCase();
  if (ev.includes("mehndi")) return getDecorImage("mehndi", "premium");
  if (ev.includes("haldi")) return getDecorImage("haldi", "premium");
  if (ev.includes("sangeet")) return getDecorImage("sangeet", "premium");
  if (ev.includes("reception")) return getDecorImage("reception", "premium");

  if (rel.includes("muslim")) return getDecorImage("nikah", "premium");
  if (rel.includes("christian")) return getDecorImage("church", "premium");
  if (rel.includes("south")) return getDecorImage("temple", "premium");
  if (rel.includes("sikh")) return getDecorImage("sangeet", "premium");
  return getDecorImage("wedding", "premium");
}

function getDecorGalleryLocal(): string[] {
  // Manifest-driven gallery under /assets/decor/*/premium
  // We intentionally return the entire decor gallery list and de-dupe later.
  // Note: the gallery resolver will normalize casing and avoid repeats.
  // Use manifest-driven gallery for decor.
  // Prefer premium decor if present; resolver de-dupes and normalizes.
  return resolveGalleryByFolder("/assets/decor").filter(Boolean) as string[];
}

function getBrideOutfitImageLocal(religion: string): string {
  const rel = (religion || "").toLowerCase();
  if (rel.includes("christian")) return getOutfitImage("bride", "bridal-gown");
  if (rel.includes("muslim")) return getOutfitImage("bride", "sharara");
  if (rel.includes("south")) return getOutfitImage("bride", "saree");
  return getOutfitImage("bride", "lehenga");
}

function getGroomOutfitImageLocal(religion: string): string {
  const rel = (religion || "").toLowerCase();
  if (rel.includes("christian")) return getOutfitImage("groom", "tuxedo");
  if (rel.includes("muslim")) return getOutfitImage("groom", "sherwani");
  if (rel.includes("south")) return getOutfitImage("groom", "kurta");
  return getOutfitImage("groom", "sherwani");
}

function getVenueImageLocal(state: string): string {
  const s = (state || "").toLowerCase();
  if (s.includes("goa")) return getVenueImage("goa", "premium");
  if (s.includes("kerala")) return getVenueImage("kerala", "premium");
  if (s.includes("rajasthan")) return getVenueImage("rajasthan", "premium");
  if (s.includes("maharashtra") || s.includes("mumbai"))
    return getVenueImage("maharashtra", "premium");
  if (s.includes("delhi")) return getVenueImage("delhi", "premium");
  if (s.includes("karnataka")) return getVenueImage("karnataka", "premium");
  if (s.includes("tamil")) return getVenueImage("tamil-nadu", "premium");
  if (s.includes("telangana") || s.includes("hyderabad"))
    return getVenueImage("telangana", "premium");
  if (s.includes("punjab")) return getVenueImage("punjab", "premium");
  if (s.includes("bengal")) return getVenueImage("west-bengal", "premium");
  return getVenueImage("rajasthan", "premium");
}

// ─── Main loader ──────────────────────────────────────────────────────────────
export async function loadWeddingData(answers?: any): Promise<AppData> {
  console.log("[WeddingLoader] Starting data load...", answers);

  if (answers) {
    console.log("[WeddingLoader] 🎯 Building plan dynamically using passed state answers");
    return { ...(await buildDynamicPlanFromLocalData(answers)), isDemo: false };
  }

  // 1. Check for Curated Journey ID in URL
  const params = new URLSearchParams(window.location.search);
  const journeyId = params.get("journeyId");

  if (journeyId) {
    console.log(`[WeddingLoader] 💎 Loading curated journey: ${journeyId}`);
    const curatedPlan = await getCuratedJourneyPlan(journeyId);
    if (curatedPlan) return curatedPlan;
  }

  const storedPlan = sessionStorage.getItem("wedding_plan");

  if (storedPlan) {
    try {
      const plan = JSON.parse(storedPlan);
      const isStale =
        plan._cacheVersion !== CACHE_VERSION ||
        !plan.planningVault ||
        !plan.events?.[0]?.outfit?.brideImage ||
        !plan.events?.[0]?.images?.[0];
      if (!isStale) {
        console.log("[WeddingLoader] ✅ Data loaded from sessionStorage");
        return { ...plan, isDemo: false };
      }
      console.log("[WeddingLoader] ♻️  Stale plan — discarding...");
      sessionStorage.removeItem("wedding_plan");
    } catch {
      sessionStorage.removeItem("wedding_plan");
    }
  }

  console.log("[WeddingLoader] 🎭 Demo mode — trying /api/sample-plan...");
  return fetchFullDemo();
}

// ─── Backend demo fetch with local dynamic fallback ─────────────────────────
async function fetchFullDemo(): Promise<AppData> {
  try {
    const res = await fetch(`${BASE}/api/sample-plan`);
    const json = await res.json();
    if (!json?.data) throw new Error("Invalid demo data structure");
    const plan = { ...json.data, _cacheVersion: CACHE_VERSION };
    sessionStorage.setItem("wedding_plan", JSON.stringify(plan));
    console.log("[WeddingLoader] ✅ Demo data loaded and cached");
    return { ...plan, isDemo: true };
  } catch (err: any) {
    console.warn(
      "[WeddingLoader] Demo fetch failed:",
      err.message,
      "— building dynamic local plan",
    );
    return { ...(await buildDynamicPlanFromLocalData()), isDemo: true };
  }
}

// ─── Dynamic Local Plan Builder ──────────────────────────────────────────────
async function buildDynamicPlanFromLocalData(answers?: any): Promise<AppData> {
  let quizAnswers = answers;
  if (!quizAnswers) {
    try {
      const stored = sessionStorage.getItem("quiz_answers");
      if (stored) quizAnswers = JSON.parse(stored);
    } catch (e) {
      console.warn("Could not read quiz_answers:", e);
    }
  }

  if (!quizAnswers) {
    quizAnswers = {
      budget: 5000000,
      guests: 250,
      religion: "hindu",
      theme: "royal",
      state: "Rajasthan",
      priorities: ["luxury_decor"],
      budgetTier: "premium",
    };
  }

  const rel = (quizAnswers.religion || "hindu").toLowerCase().replace(/[_\s]+/g, "-");
  const theme = (quizAnswers.theme || "royal").toLowerCase();
  const budgetTier =
    quizAnswers.budgetTier ||
    (quizAnswers.budget < 500000 ? "budget" : quizAnswers.budget < 1500000 ? "mid" : "premium");
  const state = quizAnswers.state || "Rajasthan";

  console.log(`[WeddingLoader] 🛠️ Building dynamic local plan for ${rel} / ${theme} / ${state}`);

  try {
    const venuesRes: any[] = [];
    const servicesRes: any[] = [];
    const eventsRes: any = {
      hindu: [
        { name: "Haldi", day: 1, type: "pre-wedding", description: "Traditional ceremony" },
        { name: "Mehndi", day: 1, type: "pre-wedding", description: "Henna ceremony" },
        { name: "Sangeet", day: 2, type: "pre-wedding", description: "Musical night" },
        { name: "Wedding Ceremony", day: 3, type: "wedding", description: "Main event" },
        { name: "Reception", day: 3, type: "post-wedding", description: "Grand celebration" },
      ],
      muslim: [
        { name: "Mehndi", day: 1, type: "pre-wedding", description: "Henna ceremony" },
        { name: "Nikah", day: 2, type: "wedding", description: "Main event" },
        { name: "Walima", day: 3, type: "post-wedding", description: "Grand celebration" },
      ],
      christian: [
        { name: "Engagement", day: 1, type: "pre-wedding", description: "Ring ceremony" },
        { name: "Church Wedding", day: 2, type: "wedding", description: "Main event" },
        { name: "Reception", day: 2, type: "post-wedding", description: "Grand celebration" },
      ],
      sikh: [
        { name: "Maiyan", day: 1, type: "pre-wedding", description: "Traditional ceremony" },
        { name: "Anand Karaj", day: 2, type: "wedding", description: "Main event" },
        { name: "Reception", day: 2, type: "post-wedding", description: "Grand celebration" },
      ],
      south: [
        { name: "Temple Wedding", day: 1, type: "wedding", description: "Main event" },
        { name: "Reception", day: 1, type: "post-wedding", description: "Grand celebration" },
      ],
    };

    const baseEvents = eventsRes[rel] || eventsRes["hindu"];

    const formattedVenues = [
      {
        id: "v1",
        name: `The Grand ${theme} Palace`,
        city: state,
        state: state,
        rating: 4.9,
        image: getVenueImageLocal(state),
        priceRange: "Premium",
      },
    ];

    const formattedEvents = baseEvents.map((evt: any, i: number) => {
      const mainImage = getEventImageLocal(evt.name, rel);
      const allDecor = getDecorGalleryLocal();
      const images = [mainImage, ...allDecor.filter((img) => img !== mainImage)];
      let brideOutfit = "Designer Lehenga";
      let groomOutfit = "Silk Sherwani";
      let coupleCoordination = "Matte Ivory & Accent Embroideries";
      let jewelry = "Polki Sets with Emerald Drops";
      let safa = "Matching Silk Safa with Kalgi";

      if (rel.includes("muslim")) {
        brideOutfit = "Heavily Embroidered Sharara";
        groomOutfit = "Velvet Sherwani";
        coupleCoordination = "Emerald Green & Antique Gold";
        jewelry = "Passa, Mangtika & Heavy Choker";
        safa = "Velvet Safa with Pearl Strings";
      } else if (rel.includes("christian")) {
        brideOutfit = "Lace Bridal Gown";
        groomOutfit = "Classic Black Tuxedo";
        coupleCoordination = "Classic White & Midnight Blue";
        jewelry = "Diamond Solitaire Pendant";
        safa = "Bowtie & Boutonniere";
      } else if (rel.includes("south")) {
        brideOutfit = "Kanjeevaram Silk Saree";
        groomOutfit = "Traditional Veshti & Silk Shirt";
        coupleCoordination = "Rich Gold & Crimson";
        jewelry = "Temple Jewelry Sets";
        safa = "No Safa (Traditional)";
      } else if (rel.includes("sikh")) {
        brideOutfit = "Heavy Salwar Kameez / Lehenga";
        groomOutfit = "Embroidered Sherwani";
        coupleCoordination = "Pastel Pinks & Gold";
        jewelry = "Chooda, Kalire & Heavy Maang Tikka";
        safa = "Coordinated Pink Turban";
      }
      const brideImg = getBrideOutfitImageLocal(rel);
      const groomImg = getGroomOutfitImageLocal(rel);
      const eventBudget = Math.round(quizAnswers.budget * 0.1);

      return {
        ...evt,
        eventBudget,
        images,
        decorGallery: images.slice(1),
        outfit: {
          bride: brideOutfit,
          groom: groomOutfit,
          brideImage: brideImg,
          groomImage: groomImg,
          brideGallery: [brideImg],
          groomGallery: [groomImg],
          coordination: coupleCoordination,
          jewelry: jewelry,
          safa: safa,
        },
      };
    });

    // 3. Budget distribution
    const budgetDistributions: Record<string, Record<string, number>> = {
      premium: {
        venue: 28,
        catering: 20,
        decor: 20,
        photography: 12,
        miscellaneous: 4,
        outfits: 8,
        entertainment: 8,
      },
      mid: {
        venue: 30,
        catering: 24,
        decor: 18,
        photography: 10,
        miscellaneous: 3,
        outfits: 10,
        entertainment: 5,
      },
      budget: {
        venue: 35,
        catering: 28,
        decor: 12,
        photography: 8,
        miscellaneous: 4,
        outfits: 10,
        entertainment: 3,
      },
    };
    const dist = budgetDistributions[budgetTier] || budgetDistributions["premium"];

    const budgetBreakdown = {
      total: quizAnswers.budget,
      tier: budgetTier,
      categories: {
        venue: {
          percentage: dist.venue || 40,
          value: Math.round(quizAnswers.budget * ((dist.venue || 40) / 100)),
        },
        catering: {
          percentage: dist.catering || 25,
          value: Math.round(quizAnswers.budget * ((dist.catering || 25) / 100)),
        },
        decor: {
          percentage: dist.decor || 20,
          value: Math.round(quizAnswers.budget * ((dist.decor || 20) / 100)),
        },
        photography: {
          percentage: dist.photography || 10,
          value: Math.round(quizAnswers.budget * ((dist.photography || 10) / 100)),
        },
        misc: {
          percentage: dist.miscellaneous || 5,
          value: Math.round(quizAnswers.budget * ((dist.miscellaneous || 5) / 100)),
        },
      },
    };

    // 4. Planning vault
    const planningVault = {
      invitations: {
        style:
          theme === "royal" ? "Royal Scroll with Gold Foil" : "Minimalist Contemporary Rose Gold",
        image: getVenueImageLocal(state),
        tips: [
          "Order 4 months in advance",
          "Include a QR code for RSVP",
          "Hand-deliver to close family",
        ],
      },
      honeymoon: {
        destination:
          theme === "royal" ? "Udaivilas, Udaipur & Switzerland" : "Maldives Water Villa",
        image: getVenueImage("goa", "premium"),
        vibe: theme === "royal" ? "Heritage & Luxury" : "Tropical Romance",
      },
      masterChecklist: [
        `Finalize ${formattedVenues[0]?.name || "venue"} booking`,
        `Select ${rel} traditional outfits`,
        `Approve menu matching ${rel} customs`,
        `Send invitations 4 months ahead`,
        `Coordinate photography timeline`,
        `Establish mehndi/sangeet setup checklist`,
      ],
    };

    const allDecorImgs = formattedEvents.flatMap((e: any) => e.images);

    return {
      religion: rel,
      theme,
      priorities: quizAnswers.priorities || ["luxury_decor"],
      venues: formattedVenues,
      events: formattedEvents,
      images: {
        // Galleries are resolved from folder structure to avoid hardcoded lists.
        venueImages: Array.from(
          new Set(
            formattedVenues
              .map((v: any) => v.image)
              .filter(Boolean)
              .map((x: string) => x.toLowerCase()),
          ),
        ).map(
          (lower: string) =>
            formattedVenues
              .map((v: any) => v.image)
              .find((v: any) => (v?.image ? v.image?.toLowerCase() : v?.toLowerCase()) === lower) ??
            lower,
        ),
        decorImages: Array.from(new Set(allDecorImgs.map((x: any) => String(x).toLowerCase())))
          .map((lower: string) => allDecorImgs.find((x: any) => String(x).toLowerCase() === lower))
          .filter(Boolean)
          .slice(0, 12) as string[],
        ceremonyImages: allDecorImgs.slice(0, 1).filter(Boolean) as string[],
        outfitImages: Array.from(
          new Set(
            formattedEvents
              .map((e: any) => e?.outfit?.brideImage)
              .filter(Boolean)
              .map((x: any) => String(x).toLowerCase()),
          ),
        )
          .map(
            (lower: string) =>
              formattedEvents.find(
                (e: any) => String(e?.outfit?.brideImage || "").toLowerCase() === lower,
              )?.outfit?.brideImage,
          )
          .filter(Boolean) as string[],
      },

      outfits: {
        theme,
        religion: rel,
        recommendations: {
          groom: formattedEvents.map((e: any) => e.outfit.groom),
          bride: formattedEvents.map((e: any) => e.outfit.bride),
        },
        byEvent: formattedEvents.map((e: any) => ({
          event: e.name,
          day: e.day,
          groom: e.outfit.groom,
          bride: e.outfit.bride,
          groomImage: e.outfit.groomImage,
          brideImage: e.outfit.brideImage,
          groomGallery: e.outfit.groomGallery,
          brideGallery: e.outfit.brideGallery,
        })),
        coordination:
          formattedEvents[0]?.outfit?.coordination || "Matte Ivory & Accent Embroideries",
        jewelry: formattedEvents[0]?.outfit?.jewelry || "Polki Sets with Emerald Drops",
        safa: formattedEvents[0]?.outfit?.safa || "Matching Silk Safa with Kalgi",
      },
      timeline: formattedEvents
        .map((e: any) => ({ day: e.day, label: `Day ${e.day}`, events: [e] }))
        .reduce((acc: any[], cur: any) => {
          const ex = acc.find((d) => d.day === cur.day);
          if (ex) ex.events.push(...cur.events);
          else acc.push(cur);
          return acc;
        }, []),
      budgetBreakdown,
      planningVault,
      summary: {
        coupleNames: quizAnswers.coupleNames || "Priyanjali & Rohan",
        weddingDate: quizAnswers.weddingDate || "2026-11-20",
        totalBudget: quizAnswers.budget,
        guests: quizAnswers.guests || 250,
        theme,
        religion: rel,
        location: state,
        perGuestCost: Math.round(quizAnswers.budget / (quizAnswers.guests || 250)),
      },
      isDemo: true,
    };
  } catch (err) {
    console.error("[WeddingLoader] Error compiling local dynamic plan:", err);
    return {
      venues: [],
      events: [],
      outfits: { byEvent: [] },
      images: { venueImages: [], decorImages: [], ceremonyImages: [], outfitImages: [] },
      budgetBreakdown: {},
      summary: {
        coupleNames: quizAnswers.coupleNames || "Priyanjali & Rohan",
        weddingDate: quizAnswers.weddingDate || "2026-11-20",
        religion: rel,
        theme,
        location: state,
        totalBudget: quizAnswers.budget,
      },
      isDemo: true,
    };
  }
}
