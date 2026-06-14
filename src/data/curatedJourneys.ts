import { AppData } from "@/lib/weddingLoader";
import { getDecorImage, getOutfitImage, getVenueImage, getFallbackImage } from "@/utils/assets";

export interface CuratedJourney {
  id: string;
  name: string;
  tagline: string;
  description: string;
  religion: string;
  theme: string;
  location: string;
  budgetTier: string;
  heroImage: string;
  palette: string[];
}

export const CURATED_JOURNEYS: CuratedJourney[] = [
  {
    id: "rajasthan-royal",
    name: "Royal Rajasthan Hindu Wedding",
    tagline: "A Legacy of Palatial Grandeur",
    description:
      "Bespoke red and gold aesthetics set against the backdrop of historic Jodhpur palaces.",
    religion: "hindu",
    theme: "royal",
    location: "Rajasthan",
    budgetTier: "premium",
    heroImage: getVenueImage("rajasthan", "premium"),
    palette: ["#B22222", "#CFB53B", "#FFD700", "#8B0000"],
  },
  {
    id: "muslim-nikah",
    name: "Luxury Muslim Nikah Wedding",
    tagline: "Timeless Nizami Elegance",
    description:
      "Emerald greens and pristine whites in a heritage Haveli setting for a cinematic Nikah.",
    religion: "muslim",
    theme: "heritage",
    location: "Hyderabad",
    budgetTier: "premium",
    heroImage: getDecorImage("nikah", "premium"),
    palette: ["#006A4E", "#CFB53B", "#FFFFFF", "#004225"],
  },
  {
    id: "christian-beach",
    name: "Christian Beach Wedding",
    tagline: "Minimalist Coastal Chic",
    description: "Ethereal white aesthetics with oceanic blues at a private Goa beachfront resort.",
    religion: "christian",
    theme: "minimalist",
    location: "Goa",
    budgetTier: "premium",
    heroImage: getVenueImage("goa", "premium"),
    palette: ["#FFFFFF", "#87CEEB", "#F5F5DC", "#4682B4"],
  },
  {
    id: "south-traditional",
    name: "South Indian Traditional Wedding",
    tagline: "The Soul of Sacred Tradition",
    description:
      "Classic yellow marigolds and rich Kanchipuram silk vibes in a temple-style courtyard.",
    religion: "south",
    theme: "traditional",
    location: "Kerala",
    budgetTier: "premium",
    heroImage: getDecorImage("temple", "premium"),
    palette: ["#FFD700", "#008000", "#FFFFFF", "#DAA520"],
  },
  {
    id: "elegant-budget",
    name: "Elegant Boutique Wedding",
    tagline: "Sophisticated Minimalism",
    description:
      "Smartly curated pastel aesthetics in a boutique garden setting for intimate luxury.",
    religion: "hindu",
    theme: "modern",
    location: "Mumbai",
    budgetTier: "mid",
    heroImage: getVenueImage("maharashtra", "mid"),
    palette: ["#FADADD", "#B0E0E6", "#F5F5DC", "#E6E6FA"],
  },
];

// Simple image helpers using imageEngine
function getEventImage(eventName: string, religion: string): string {
  const rel = (religion || "").toLowerCase();
  const ev = (eventName || "").toLowerCase();
  return getDecorImage(ev, "premium");
}

function getDecorGallery(religion: string, theme: string): string[] {
  return [
    getDecorImage("wedding", "premium"),
    getDecorImage("haldi", "premium"),
    getDecorImage("sangeet", "premium"),
    getDecorImage("reception", "premium"),
    getDecorImage("engagement", "premium"),
    getDecorImage("mehndi", "premium"),
  ];
}

function getBrideOutfitImage(theme: string, religion: string): string {
  if (religion?.includes("christian")) return getOutfitImage("bride");
  return getOutfitImage("bride");
}

function getGroomOutfitImage(theme: string, religion: string): string {
  if (religion?.includes("christian")) return getOutfitImage("groom");
  return getOutfitImage("groom");
}

function getLocalVenueImage(location: string): string {
  return getVenueImage(location, "premium");
}

export async function getCuratedJourneyPlan(id: string): Promise<AppData | null> {
  const journey = CURATED_JOURNEYS.find((j) => j.id === id);
  if (!journey) return null;

  const rel = journey.religion;
  const theme = journey.theme;

  const totalBudget = id === "elegant-budget" ? 1500000 : id.includes("royal") ? 8000000 : 5000000;
  const guests = id === "elegant-budget" ? 80 : 300;

  const decorArr = getDecorGallery(rel, theme);

  const IMG = {
    engagement: [getEventImage("engagement", rel), decorArr[0], decorArr[1]],
    mehndi: [getEventImage("mehndi", rel), decorArr[2], decorArr[3]],
    haldi: [getEventImage("haldi", rel), decorArr[0], decorArr[1]],
    sangeet: [getEventImage("sangeet", rel), decorArr[2], decorArr[3]],
    wedding: [getEventImage("wedding", rel), decorArr[4], decorArr[5]],
    reception: [getEventImage("reception", rel), decorArr[0], decorArr[5]],
    brideWed: getBrideOutfitImage(theme, rel),
    groomWed: getGroomOutfitImage(theme, rel),
    venue: getLocalVenueImage(journey.location),
  };

  const venues = [
    {
      name:
        id === "rajasthan-royal"
          ? "Umaid Bhawan Palace"
          : id === "christian-beach"
            ? "Azure Sands Resort"
            : journey.name + " Venue",
      state: journey.location,
      city: journey.location,
      rating: 5.0,
      priceCategory: "premium",
      capacity: guests * 1.5,
      type: "exclusive",
      image: IMG.venue,
      amenities: ["Cinematic Vistas", "Royal Concierge", "Heritage Suites", "Bespoke Catering"],
      pricing: id === "elegant-budget" ? "₹₹" : "₹₹₹₹",
      styles: [journey.theme, "heritage", "luxury"],
    },
  ];

  const events = [
    {
      name: "The Grand Welcome",
      day: 1,
      timing: "Morning",
      type: "pre-wedding",
      decorTheme: journey.theme + " Minimalist",
      description: "Arrival of guests and traditional welcome ritual.",
      images: IMG.engagement.slice(0, 3),
      outfit: {
        bride: "Day Couture",
        groom: "Bespoke Linen",
        brideImage: IMG.engagement[0],
        groomImage: IMG.engagement[1],
        brideGallery: [IMG.engagement[0]],
        groomGallery: [IMG.engagement[1]],
        colorPalette: journey.palette.slice(0, 2),
      },
      photographyShotIdeas: ["Arrival moments", "Candids"],
      menuSuggestions: ["Welcome Drinks", "Local Appetizers"],
    },
    {
      name: "Mehndi & Sangeet",
      day: 2,
      timing: "Evening",
      type: "celebration",
      decorTheme: journey.name + " Festive",
      description: "A night of music, dance, and intricate henna artistry.",
      images: IMG.sangeet,
      outfit: {
        bride: "Lehenga with Mirror Work",
        groom: "Classic Bandhgala",
        brideImage: IMG.sangeet[0],
        groomImage: IMG.sangeet[1],
        brideGallery: [IMG.sangeet[0]],
        groomGallery: [IMG.sangeet[1]],
        colorPalette: journey.palette,
      },
      photographyShotIdeas: ["Performance shots", "Mehndi details"],
      menuSuggestions: ["Global Fusion", "Interactive Food Stations"],
    },
    {
      name: "The Wedding Ceremony",
      day: 3,
      timing: "Morning",
      type: "ceremony",
      decorTheme: journey.name + " Altar",
      description: `The sacred union of two souls under the ${journey.theme} mandap, orchestrated with divine precision.`,
      images: IMG.wedding,
      outfit: {
        bride:
          id === "rajasthan-royal"
            ? "Heritage Red Zardosi Lehenga"
            : id === "christian-beach"
              ? "Silk Crepe Backless Gown"
              : "Grand Atelier Couture",
        groom:
          id === "rajasthan-royal"
            ? "Royal Gold Sherwani"
            : id === "christian-beach"
              ? "Linen Summer Suit"
              : "Bespoke Royal Ensemble",
        brideImage: IMG.brideWed,
        groomImage: IMG.groomWed,
        brideGallery: [IMG.brideWed, ...IMG.wedding.slice(0, 3)],
        groomGallery: [IMG.groomWed, ...IMG.wedding.slice(0, 3)],
        colorPalette: journey.palette,
      },
      photographyShotIdeas: [
        id === "rajasthan-royal" ? "Drone palace wide shot" : "Emotional beach sunset vow",
        "Cinematic entry with smoke",
        "Traditional ritual closeups",
        "The first glance (First Look)",
      ],
      menuSuggestions: [
        id === "rajasthan-royal"
          ? "Dal Baati Churma (Royal)"
          : id === "christian-beach"
            ? "Seafood Platter & White Wine"
            : "Signature Regional Cuisine",
        "Luxury Dessert Bar with Gold Dust",
      ],
      stageInspiration: { theme: journey.name + " Masterpiece", images: [IMG.wedding[0]] },
    },
  ];

  const planningVault = {
    invitations: {
      style: id === "rajasthan-royal" ? "Gold Leaf Scroll" : "Minimalist Letterpress",
      image: IMG.wedding[2] ?? getFallbackImage(),
      tips: [
        "Include a QR code for the cinematic teaser",
        "Order custom wax seals with your initials",
        "Use recycled handmade paper for eco-luxury",
      ],
    },
    masterChecklist: [
      "Finalize Cinematic Storyboard",
      "Coordinate with International Makeup Artist",
      "Book Drone & Gimbal Specialists",
    ],
  };

  return {
    venues,
    events,
    outfits: {
      theme: journey.theme,
      religion: journey.religion,
      byEvent: events.map((e) => ({
        event: e.name,
        bride: e.outfit.bride,
        groom: e.outfit.groom,
        brideImage: e.outfit.brideImage,
        groomImage: e.outfit.groomImage,
        brideGallery: e.outfit.brideGallery,
        groomGallery: e.outfit.groomGallery,
      })),
    },
    images: {
      venueImages: [IMG.venue],
      decorImages: [...IMG.wedding, ...IMG.sangeet].slice(0, 10),
      ceremonyImages: IMG.wedding,
      outfitImages: [IMG.brideWed, IMG.groomWed],
    },
    budgetBreakdown: {
      total: totalBudget,
      categories: {
        venue: { percentage: 40, value: totalBudget * 0.4 },
        catering: { percentage: 25, value: totalBudget * 0.25 },
        decor: { percentage: 20, value: totalBudget * 0.2 },
        photography: { percentage: 10, value: totalBudget * 0.1 },
        misc: { percentage: 5, value: totalBudget * 0.05 },
      },
    },
    summary: {
      totalBudget,
      guests,
      theme: journey.theme,
      religion: rel,
      location: journey.location,
    },
    planningVault,
    isDemo: false,
  };
}
