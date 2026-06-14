import {
  Wallet,
  Users,
  Sparkles,
  MapPin,
  Heart,
  BookOpen,
  Star,
  Camera,
  Palmtree,
  Crown,
  Flame,
  Paintbrush,
  Minus,
} from "lucide-react";
import { getDecorImage } from "../utils/imageResolver";

// The unified final list of 10 supported states for the platform
export const INDIAN_STATES = [
  "Rajasthan",
  "Goa",
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Delhi",
  "Maharashtra",
  "Punjab",
];

export const THEMES = [
  { name: "Royal", desc: "Opulent gold, crystal & grand florals" },
  { name: "Traditional", desc: "Heritage colours, marigold & earthy tones" },
  { name: "Minimalist", desc: "Clean, timeless, soft palette" },
  { name: "Boho", desc: "Earthy, rustic and unconventional" },
  { name: "Modern", desc: "Contemporary, chic and sleek" },
  { name: "Luxury", desc: "High-end bespoke premium aesthetics" },
  { name: "Beach", desc: "Breezy, tropical and oceanfront vibes" },
];

export const RELIGIONS = [
  {
    name: "Hindu",
    desc: "Haldi, Mehndi, Sangeet, Saptapadi & more",
    emoji: "🪔",
    color: "from-orange-900/70 to-red-900/60",
    bg: getDecorImage("haldi", "premium"),
    events: ["Haldi", "Mehndi", "Sangeet", "Saptapadi", "Reception"],
  },
  {
    name: "Muslim",
    desc: "Mehndi, Mangni, Nikah, Walima ceremonies",
    emoji: "🌙",
    color: "from-emerald-900/70 to-teal-900/60",
    bg: getDecorImage("nikah", "premium"),
    events: ["Mangni", "Mehndi", "Nikah", "Walima"],
  },
  {
    name: "Christian",
    desc: "Bridal Shower, Church ceremony & Reception",
    emoji: "⛪",
    color: "from-slate-900/70 to-blue-900/60",
    bg: getDecorImage("church", "premium"),
    events: ["Bridal Shower", "Church Ceremony", "Reception"],
  },
  {
    name: "Sikh",
    desc: "Maiyan, Jaggo, Anand Karaj & Reception",
    emoji: "🪬",
    color: "from-amber-900/70 to-yellow-900/60",
    bg: getDecorImage("sangeet", "premium"),
    events: ["Maiyan", "Jaggo", "Anand Karaj", "Reception"],
  },
  {
    name: "South Indian",
    desc: "Vrutham, Muhurtham & Grand Sadya ceremony",
    emoji: "🌸",
    color: "from-rose-900/70 to-pink-900/60",
    bg: getDecorImage("temple", "premium"),
    events: ["Vrutham", "Muhurtham", "Sadya"],
  },
];

export const PRIORITIES = [
  {
    id: "luxury_decor",
    label: "Luxury Decor",
    desc: "Florals, drapes & opulent ambience",
    icon: Sparkles,
  },
  {
    id: "budget_friendly",
    label: "Budget Friendly",
    desc: "Maximum value, minimum spend",
    icon: Wallet,
  },
  {
    id: "destination_wedding",
    label: "Destination Wedding",
    desc: "Iconic location away from home",
    icon: MapPin,
  },
  {
    id: "photography",
    label: "Photography",
    desc: "Cinematic memories & photoshoots",
    icon: Camera,
  },
  {
    id: "outdoor_wedding",
    label: "Outdoor Wedding",
    desc: "Garden, beach or open-air",
    icon: Palmtree,
  },
  {
    id: "celebrity_style",
    label: "Celebrity Style",
    desc: "Bollywood-level grandeur",
    icon: Crown,
  },
  {
    id: "traditional_rituals",
    label: "Traditional Rituals",
    desc: "Authentic cultural ceremonies",
    icon: Flame,
  },
  {
    id: "modern_theme",
    label: "Modern Theme",
    desc: "Contemporary minimalist glam",
    icon: Paintbrush,
  },
  {
    id: "minimalist_wedding",
    label: "Minimalist",
    desc: "Clean, intimate, understated",
    icon: Minus,
  },
];

export const BUDGET_TIERS = [
  { id: "budget", label: "Boutique (Budget)", threshold: 450000 },
  { id: "mid", label: "Premium (Mid)", threshold: 1000000 },
  { id: "high", label: "Ultra-Luxury (High)", threshold: 2500000 },
];
