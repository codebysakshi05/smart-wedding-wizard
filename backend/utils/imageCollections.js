/**
 * backend/utils/imageCollections.js
 *
 * THE CENTRALIZED IMAGE REPOSITORY for Dream Weaver AI.
 * Consists of high-resolution, curated Unsplash IDs for realistic Indian wedding visuals.
 *
 * Categories:
 * - Religions (Hindu, Muslim, Christian, Sikh, South Indian)
 * - Events (Engagement, Mehndi, Haldi, Sangeet, Wedding, Reception)
 * - Venues (Palace, Beach, Resort, Luxury Hotel, Heritage, Garden)
 * - Outfits (Bride, Groom)
 * - Decor & Ambiance
 */

const COLLECTIONS = {
  // ─── RELIGIONS ──────────────────────────────────────────────────────────
  religions: {
    hindu: [
      "1511795409834-ef04bbd61622", // Mandap with roses
      "1542314831-068cd1dbfeeb", // Traditional Red ritual
      "1511285560929-80b456fea0bc", // Modern Pastel decor
      "1564501049412-61c2a3083791", // Luxury Floral setup
      "1582645663737-234b077a7b8e", // Palace Backdrop
      "1519741497674-611481863552", // Minimalist Ritual
      "1568084680786-a84f91d1153c", // Royal Gold theme
      "1520250497591-112f2f40a3f4", // Boho Traditional
    ],
    muslim: [
      "1530541900018-8144b55b74b5", // Grand Stage Decor
      "1519225421980-715cb0215aed", // Nikah Ivory Elegance
      "1558618666-fcd25c85cd64", // Floral Reception Stage
      "1507504031003-b417219a0fde", // Traditional Henna/Nikah Setup
      "1529156069898-49572c9d19ce", // Bridal Muslim Ambiance
      "1599557354-cf3a8584f07f", // Modern Nikah Style
    ],
    christian: [
      "1515934759293-b120c19fb826", // Church Ceremony Altar
      "1471967183376-140f6e4a0420", // Luxury Reception Hall
      "1519741497674-611481863552", // Minimalist White Ceremony
      "1511795409834-ef04bbd61622", // Grand Hotel Ballroom
      "1515404935165-c615d3e85313", // Floral Wedding Decor
    ],
    sikh: [
      "1524492412937-b28074a5d7da", // Gurudwara Palki Sahib Setup
      "1499916078039-922301b0eb9b", // Anand Karaj Decor
      "1519167758481-83f550bb49b3", // Traditional Ceremony Detail
      "1610363259503-349f2b842978", // Royal Sikh Heritage
    ],
    "south-indian": [
      "1515404935165-c615d3e85313", // Jasmine & Marigold Temple
      "1504106518115-467406a36f90", // Traditional Gold & Silk Ambiance
      "1582645663737-234b077a7b8e", // South Indian Temple Decor
      "1511285560929-80b456fea0bc", // Modern South Indian Aesthetic
    ],
  },

  // ─── EVENTS ─────────────────────────────────────────────────────────────
  events: {
    roka: [
      "1519225421980-715cb0215aed", // Intimate ceremony setup
      "1511795409834-ef04bbd61622", // Warm family lighting
    ],
    engagement: [
      "1600091166971-7f9faad6f3cc", // Sparkle Stage for Ring Exchange
      "1470225620780-dba8ba36b745", // Traditional Dance & Decor
      "1429962714451-159b222d0d46", // Modern Ring Ceremony Vibe
    ],
    mehndi: [
      "1614886137809-8ad43db89a6a", // Boho Greenery & Swing
      "1573074617613-fc8ef27eaa2f", // Traditional Henna Patterns & Florals
      "1602173574767-37ac01994b2a", // Vibrant Outdoor Mehndi Setup
    ],
    haldi: [
      "1602173574767-37ac01994b2a", // Marigold Canopy & Petals
      "1583391733956-6c78276477e2", // Traditional Yellow Ritual Ambiance
      "1573074617613-fc8ef27eaa2f", // Bright Sunlit Garden Haldi
      "1621184455862-c163dfb30e0f", // Heritage Style Haldi Setup
    ],
    sangeet: [
      "1600091166971-7f9faad6f3cc", // High-tech LED Stage
      "1470225620780-dba8ba36b745", // Vibrant Performance Floor
      "1511795409834-ef04bbd61622", // Grand Ballroom Sangeet
    ],
    wedding: [
      "1511795409834-ef04bbd61622", // Iconic Royal Mandap
      "1542314831-068cd1dbfeeb", // Traditional Red Ceremony
      "1519225421980-715cb0215aed", // Ivory Nikah Backdrop
      "1524492412937-b28074a5d7da", // Sacred Gurudwara Ceremony
    ],
    reception: [
      "1622398925373-3f91b1e275f5", // Sleek Modern Stage
      "1569154941061-e231b4725ef1", // Formal Reception Ballroom
      "1465495976277-4387d4b0b4c6", // Traditional Grandeur Reception
    ],
  },

  // ─── VENUES ─────────────────────────────────────────────────────────────
  venues: {
    palace: [
      "1582645663737-234b077a7b8e", // Rajasthani Palace
      "1519225421980-715cb0215aed", // Heritage Architecture Detail
    ],
    beach: [
      "1507525428034-b723cf961d3e", // Sunset Beach Mandap
      "1476514525535-07fb3b4ae5f1", // Coastal Destination Wedding
    ],
    resort: [
      "1530521954074-e64f6810b32d", // Tropical Kerala Resort
      "1465495976277-4387d4b0b4c6", // Luxury Hill Station Resort
    ],
    "luxury hotel": [
      "1569154941061-e231b4725ef1", // Five-Star Ballroom
      "1511795409834-ef04bbd61622", // Grand Lobby & Banquet Style
    ],
    heritage: [
      "1610363259503-349f2b842978", // Ancient Fort/Heritage Site
      "1519225421980-715cb0215aed", // Traditional Courtyard Style
    ],
    garden: [
      "1602173574767-37ac01994b2a", // Lush Garden Floral Decor
      "1511285560929-80b456fea0bc", // Minimalist Outdoor Setup
    ],
  },

  // ─── OUTFITS ────────────────────────────────────────────────────────────
  outfits: {
    "bride lehenga": [
      "1583896066748-79b67ba40c0e", // Deep Red Bridal Lehenga
      "1591543620767-582b2e76369e", // Traditional Zardosi Work
    ],
    "muslim bridal": [
      "1583623025690-4f0add3b5b78", // Exquisite Muslim Bridal Suit
      "1529156069898-49572c9d19ce", // Nikkah Gharara/Sharara Detail
    ],
    "christian gown": [
      "1519741497674-611481863552", // Minimalist Lace Gown
      "1515934759293-b120c19fb826", // Grand Cathedral Veil
    ],
    "groom sherwani": [
      "1595515106969-1ce29566ff3c", // Regal Cream/Gold Sherwani
      "1622398925373-3f91b1e275f5", // Traditional Silk Groomswear
    ],
    tuxedo: [
      "1614886137809-8ad43db89a6a", // Modern Slim Fit Tux
      "1465495976277-4387d4b0b4c6", // Classic Black Tie Suit
    ],
  },

  // ─── MISC / DECOR ──────────────────────────────────────────────────────
  photography: [
    "1583896066748-79b67ba40c0e", // Emotional Bridal Close-up
    "1595515106969-1ce29566ff3c", // Groom Portrait Detail
    "1511795409834-ef04bbd61622", // Atmospheric Event Shot
  ],
  honeymoon: [
    "1507525428034-b723cf961d3e", // Serene Beach Destination
    "1515404935165-c615d3e85313", // Private Luxury Getaway
  ],
  stages: [
    "1511795409834-ef04bbd61622", // Monumental Royal Stage
    "1530541900018-8144b55b74b5", // Modern Linear Stage Design
    "1569154941061-e231b4725ef1", // Lush Floral Wall Stage
    "1519225421980-715cb0215aed", // Antique Heritage Stage Setup
    "1600091166971-7f9faad6f3cc", // LED & Crystal Sangeet Stage
  ],
  food: [
    "1514362545867-3e34b830117d", // Fine Dining Platter
    "1551218808-94e220e084d2", // Traditional Indian Feast
    "1476224203421-9ac3993547a1", // Gourmet Dessert Selection
    "1467003909585-2f8a72700288", // Modern Buffet Presentation
    "1504674900247-0877df9cc836", // Exotic Fusion Cuisine
  ],
};

module.exports = COLLECTIONS;
