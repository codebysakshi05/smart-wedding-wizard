import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { useLocation } from "@tanstack/react-router";
import {
  MapPin, Users, Wallet, CalendarHeart, Sparkles, Shirt,
  Star, X, Maximize2, Utensils, Heart, Share2, Printer,
  Award, Camera, CheckCircle2, ChevronRight, Download,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_SERVICES } from "../data/mockData";
import { saveWeddingPlan } from "../utils/storage";
import SmartImage from "../components/ui/SmartImage";
import VenueMap from "../components/common/VenueMap";
import VendorPortfolioModal from "../components/common/VendorPortfolioModal";
import {
  buildWeddingPlan,
  getDecorGallery,
  getVenuesByStateAndTier,
  getOutfitsByReligionAndTier,
  computeBudgetBreakdown,
  RELIGION_EVENTS,
  buildEventPlan,
} from "../utils/weddingImageEngine";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inr = (n) => "₹" + (n || 0).toLocaleString("en-IN");

function normRel(raw = "") {
  const k = raw.toLowerCase().replace(/[\s_-]+/g, "");
  if (k.includes("south")) return "south";
  if (k.includes("muslim")) return "muslim";
  if (k.includes("christian")) return "christian";
  if (k.includes("sikh")) return "sikh";
  return "hindu";
}

function normTier(budget = 1000000) {
  if (budget < 600000) return "budget";
  if (budget < 2000000) return "mid";
  return "premium";
}

// ─── Religion visual themes ───────────────────────────────────────────────────
const RELIGION_STYLES = {
  hindu: {
    themeName: "Royal Hindu Mandap & Marigold",
    accentGradient: "from-red-600 via-amber-500 to-yellow-300",
    accentText: "text-amber-400",
    glowColor: "rgba(220,38,38,0.15)",
    tagBg: "bg-red-500/10 border border-red-500/20 text-red-400",
    accentBg: "bg-gradient-to-r from-red-600 to-amber-500 text-white",
    borderColor: "border-red-500/20 group-hover:border-red-500/40",
    aestheticName: "Marigold & Royal Gold Aesthetics",
    desc: "A celebration of Vedic rituals, marigold floral curtains, and palatial grandeur.",
    colorsList: "Crimson Red, Marigold Yellow & Matte Gold",
    lighting: "Warm copper lanterns, orange up-lighting, and clay diyas.",
    menuTitle: "Royal Vedic Feast",
    menuItems: {
      counters: ["Organic Marigold Kulfi Stall", "Banarasi Chaat Live Grid", "Fire Paan Station"],
      mains: ["Shahi Paneer Lazeez", "Dal Makhani Slow-cooked", "Woodfired Naan Platters"],
      drinks: ["Kesar Pista Milk", "Muddled Mango Lassi", "Rosewater Sherbet"],
    },
    photoTips: "Focus on Varmala petal bursts, Agni fire reflections, and candid smiles during Kanyadaan.",
    checklist: ["Book palace venue 12 months ahead", "Hire pandit & book muhurtham date", "Commission lehenga 8 months prior", "Book florist for marigold installations", "Arrange mehndi artists 3 months out", "Plan sangeet choreographer 4 months ahead", "Book drone & cinematic photographer", "Finalize catering menu 2 months out", "Order wedding invitations 3 months prior", "Plan honeymoon destination"],
  },
  muslim: {
    themeName: "Emerald & Nawabi Chandelier",
    accentGradient: "from-emerald-600 via-green-500 to-amber-400",
    accentText: "text-emerald-400",
    glowColor: "rgba(10,185,129,0.15)",
    tagBg: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    accentBg: "bg-gradient-to-r from-emerald-600 to-amber-500 text-white",
    borderColor: "border-emerald-500/20 group-hover:border-emerald-500/40",
    aestheticName: "Emerald & Nawabi Gold Luxury",
    desc: "A grand display of crystal chandeliers, Persian rugs, and calligraphy arches.",
    colorsList: "Deep Emerald Green, Matte Gold & Cream White",
    lighting: "Dim crystal chandeliers, warm candle glow, and fairy-lit arches.",
    menuTitle: "Nawabi Banquet Spread",
    menuItems: {
      counters: ["Moroccan Mint Tea Station", "Galouti Kebab Live Grill", "Assorted Baklava Bar"],
      mains: ["Shahi Mutton Biryani", "Mirchi Ka Salan", "Slow-cooked Nihari with Kulcha"],
      drinks: ["Rooh Afza Milkshake", "Saffron Mint Cooler", "Traditional Kahwa"],
    },
    photoTips: "Focus on Qubool Hai signatures, mirror-reflection décor, and the grand entrance spotlight.",
    checklist: ["Book chandelier banquet hall 10 months out", "Arrange Qazi / Maulana early", "Commission sharara 6 months ahead", "Book mehndi artist 3 months prior", "Plan Walima menu with halal caterer", "Book calligraphy artist for backdrop", "Arrange professional Nikah photography", "Order emerald & gold invitation suite", "Plan bridal jewellery set 4 months out", "Book luxury car for Baraat"],
  },
  christian: {
    themeName: "White Floral Cathedral Elegance",
    accentGradient: "from-slate-400 via-neutral-100 to-slate-300",
    accentText: "text-slate-300",
    glowColor: "rgba(255,255,255,0.08)",
    tagBg: "bg-white/10 border border-white/20 text-neutral-300",
    accentBg: "bg-gradient-to-r from-slate-600 to-slate-400 text-white",
    borderColor: "border-white/10 group-hover:border-white/30",
    aestheticName: "White Floral Cathedral Elegance",
    desc: "A classic harmony of white roses, glass candelabras, and delicate drapes.",
    colorsList: "Ivory White, Silver Frost & Soft Blush Rose",
    lighting: "Warm dim bulb projections, towering candelabras, and white fairy lights.",
    menuTitle: "Cathedral Brunch & Feast",
    menuItems: {
      counters: ["Cheese & Charcuterie Board", "Live Pasta & Risotto Station", "Artisanal Crêpe Counter"],
      mains: ["Roasted Salmon with Dill", "Herb Roasted Chicken", "Truffle Butter Tagliatelle"],
      drinks: ["Sparkling Cider", "Lavender Elderflower Tonic", "Espresso Martini Station"],
    },
    photoTips: "Focus on the aisle walk, first kiss, bouquet toss, and dynamic spins on the dance floor.",
    checklist: ["Book church / chapel 12 months ahead", "Commission bridal gown 9 months prior", "Book priest / pastor early", "Arrange professional string quartet", "Order white floral installations 4 months out", "Book wedding photographer & videographer", "Plan reception ballroom décor 5 months out", "Design custom wedding stationery", "Book wedding cake designer", "Plan honeymoon itinerary"],
  },
  sikh: {
    themeName: "Anand Karaj & Pastel Phulkari",
    accentGradient: "from-pink-500 via-orange-400 to-amber-300",
    accentText: "text-pink-300",
    glowColor: "rgba(244,63,94,0.12)",
    tagBg: "bg-pink-500/10 border border-pink-500/20 text-pink-400",
    accentBg: "bg-gradient-to-r from-pink-500 to-amber-400 text-white",
    borderColor: "border-pink-500/20 group-hover:border-pink-500/40",
    aestheticName: "Pastel Phulkari & Heritage Prints",
    desc: "A serene blending of Gurbani hymns, pastel peach/pink drapery, and heritage prints.",
    colorsList: "Dusty Rose, Peach Saffron & Warm Ivory",
    lighting: "Natural morning sunlight, warm yellow strings, and pastel pink lanterns.",
    menuTitle: "Sikh Heritage Langar Feast",
    menuItems: {
      counters: ["Hot Jalebi & Rabri Station", "Amritsari Kulcha Live Counter", "Dahi Bhalla Grid"],
      mains: ["Slow-simmered Sarson Da Saag", "Makki Di Roti", "Karah Prashad & Kheer"],
      drinks: ["Creamy Malai Lassi", "Spiced Masala Chai", "Sweet Almond Milk"],
    },
    photoTips: "Focus on Lavan circumambulations, Guru Granth Sahib prayers, and high-energy Jaggo dance shots.",
    checklist: ["Book gurudwara 12 months ahead", "Commission lehenga 8 months prior", "Book Raagi jatha for Anand Karaj", "Plan Maiyan ceremony details", "Book phulkari décor specialist", "Arrange Bhangra / Giddha performers", "Book cinematic wedding photographer", "Plan langar menu with caterer 3 months out", "Order pastel invitation suite", "Arrange luxury car for Baraat"],
  },
  south: {
    themeName: "Jasmine & Heritage Temple",
    accentGradient: "from-amber-600 via-yellow-500 to-yellow-300",
    accentText: "text-amber-400",
    glowColor: "rgba(245,158,11,0.15)",
    tagBg: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
    accentBg: "bg-gradient-to-r from-amber-600 to-yellow-500 text-white",
    borderColor: "border-amber-500/20 group-hover:border-amber-500/40",
    aestheticName: "Jasmine & Temple Aesthetics",
    desc: "A beautiful fusion of fresh jasmine garlands, brass lamps, and banana leaves.",
    colorsList: "Temple Gold, Jasmine Cream & Emerald Leaf Green",
    lighting: "Heavy brass lamps (Kuthuvilakku), warm halogen wash, and oil lights.",
    menuTitle: "Grand South Indian Sadya",
    menuItems: {
      counters: ["Live Appam & Stew Corner", "Filter Coffee Stall", "Hot Banana Chips"],
      mains: ["Avial, Thoran & Sambar", "Traditional Sadya on Banana Leaf", "Lemon & Tamarind Rice"],
      drinks: ["Elaneer Payasam Mocktail", "Butter Milk (Moor)", "Tender Coconut Water"],
    },
    photoTips: "Focus on tying the Mangalsutra, shower of yellow Akshata rice, and traditional Nadaswaram musicians.",
    checklist: ["Book temple / heritage venue 12 months ahead", "Commission Kanjeevaram saree 8 months prior", "Book Nadaswaram musicians early", "Arrange jasmine & banana leaf decorations", "Book traditional jewellery set 5 months out", "Plan Sadya menu with authentic caterer", "Book professional wedding photographer", "Order traditional palm-leaf invitations", "Arrange brass lamp installations", "Plan honeymoon to Kerala / Coorg"],
  },
};

export default function Results({ appData, onSavePlan }) {
  const location = useLocation();
  const routeState = location?.state;
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [savedVenues, setSavedVenues] = useState([]);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [allServices, setAllServices] = useState([]);

  // ── Extract raw inputs ────────────────────────────────────────────────────
  const rawReligion = routeState?.religion || appData?.summary?.religion || appData?.religion || "Hindu";
  const rawState    = routeState?.state    || appData?.summary?.location  || "Rajasthan";
  const rawBudget   = Number(routeState?.budget || appData?.summary?.totalBudget || appData?.budgetBreakdown?.total || 1000000);
  const rawGuests   = Number(routeState?.guests  || appData?.summary?.guests || 200);
  const rawTheme    = routeState?.theme    || appData?.summary?.theme || "Royal";
  const coupleNames = appData?.summary?.coupleNames || routeState?.coupleNames || "";

  // ── Compute derived values ────────────────────────────────────────────────
  const religion = normRel(rawReligion);
  const tier     = normTier(rawBudget);
  const styles   = RELIGION_STYLES[religion] || RELIGION_STYLES.hindu;

  // ── Build fully personalized plan using image engine ─────────────────────
  const plan = useMemo(() =>
    buildWeddingPlan(religion, rawState, rawBudget, rawGuests, rawTheme),
    [religion, rawState, rawBudget, rawGuests, rawTheme]
  );

  // ── Events ────────────────────────────────────────────────────────────────
  const events = useMemo(() => {
    const names = RELIGION_EVENTS[religion] || RELIGION_EVENTS.hindu;
    return names.map((name, i) =>
      buildEventPlan(name, religion, tier, i, rawBudget, names.length)
    );
  }, [religion, tier, rawBudget]);

  // ── Venues ────────────────────────────────────────────────────────────────
  const venues = useMemo(() =>
    getVenuesByStateAndTier(rawState, tier),
    [rawState, tier]
  );

  // ── Outfits ───────────────────────────────────────────────────────────────
  const outfits = useMemo(() =>
    getOutfitsByReligionAndTier(religion, tier),
    [religion, tier]
  );

  // ── Decor gallery (unique images) ─────────────────────────────────────────
  const decorGallery = useMemo(() =>
    getDecorGallery(religion, tier),
    [religion, tier]
  );

  // ── Budget breakdown ──────────────────────────────────────────────────────
  const budgetLines = useMemo(() =>
    computeBudgetBreakdown(rawBudget, tier, religion),
    [rawBudget, tier, religion]
  );

  // ── Load favourites & services ────────────────────────────────────────────
  useEffect(() => {
    try {
      const si = localStorage.getItem("dream_weaver_saved");
      if (si) setSavedImages(JSON.parse(si));
      const sv = localStorage.getItem("saved_vendors");
      if (sv) setSavedVenues(JSON.parse(sv));
    } catch (_) {}
    setAllServices(MOCK_SERVICES || []);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const togglePin = (img) => {
    const next = savedImages.includes(img)
      ? savedImages.filter((x) => x !== img)
      : [...savedImages, img];
    setSavedImages(next);
    localStorage.setItem("dream_weaver_saved", JSON.stringify(next));
    toast.success(savedImages.includes(img) ? "Removed from moodboard" : "Saved to moodboard!");
  };

  const toggleVenue = (id, name) => {
    const next = savedVenues.includes(id)
      ? savedVenues.filter((x) => x !== id)
      : [...savedVenues, id];
    setSavedVenues(next);
    localStorage.setItem("saved_vendors", JSON.stringify(next));
    toast.success(savedVenues.includes(id) ? `Removed ${name}` : `Shortlisted ${name}!`);
  };

  const handleSavePlan = async () => {
    if (!user) { toast.error("Please log in to save your plan"); return; }
    setIsSavingPlan(true);
    try {
      await apiFetch("/save-plan", {
        method: "POST",
        body: JSON.stringify({ plan, budget: rawBudget, theme: rawTheme, guests: rawGuests }),
      });
      saveWeddingPlan({ religion: rawReligion, state: rawState, budget: rawBudget, guests: rawGuests, theme: rawTheme, plan });
      toast.success("Wedding plan saved to your dashboard!");
      if (onSavePlan) onSavePlan();
    } catch (err) {
      toast.error("Failed to save plan");
    } finally {
      setIsSavingPlan(false);
    }
  };

  // ── Filtered services ─────────────────────────────────────────────────────
  const getServices = (cat) => {
    const list = allServices.filter((s) => s?.category === cat);
    if (!list.length) return [];
    const scored = list.map((s) => {
      let score = 0;
      if (s.budget === tier || s.budget === (tier === "premium" ? "high" : tier)) score += 5;
      const tags = (s.tags || []).map((t) => t.toLowerCase());
      if (tags.includes(religion)) score += 3;
      return { s, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 2).map((x) => x.s);
  };

  // ── Hero image = first decor image ───────────────────────────────────────
  const heroImage = decorGallery[0] || events[0]?.decorImage || "/assets/fallback/cover.webp";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-primary selection:text-neutral-900 pb-24">
      {/* ─── IMAGE LIGHTBOX ─── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-[90vh] rounded-3xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ─── VENDOR PORTFOLIO MODAL ─── */}
      {selectedVendor && (
        <VendorPortfolioModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-end justify-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage
            path={heroImage}
            alt="Wedding Moodboard"
            className="w-full h-full object-cover brightness-[0.22] contrast-[1.08] scale-105"
            fallbackType="decor"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)` }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-5 max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${styles.tagBg} backdrop-blur-md`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold">AI-Curated Wedding Plan</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none">
              {coupleNames ? `${coupleNames}'s` : "Your"}{" "}<br />
              <span className={`italic bg-gradient-to-r ${styles.accentGradient} bg-clip-text text-transparent`}>
                {styles.themeName}
              </span>
            </h1>
            <p className="font-serif italic text-white/60 text-lg md:text-xl max-w-xl">
              {styles.desc}
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleSavePlan}
              disabled={isSavingPlan}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest ${styles.accentBg} transition-all hover:brightness-110`}
            >
              <Download className="w-4 h-4" />
              {isSavingPlan ? "Saving..." : "Save Plan"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest bg-white/10 border border-white/10 hover:bg-white/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </section>

      {/* ─── SUMMARY STRIP ─── */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 mb-20">
        <div className="glass rounded-[2.5rem] p-8 shadow-luxury border border-white/10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            { label: "Wedding Date",  value: appData?.summary?.weddingDate || "2026-11-20", icon: CalendarHeart },
            { label: "Destination",   value: rawState,                                       icon: MapPin },
            { label: "Total Budget",  value: inr(rawBudget),                                  icon: Wallet },
            { label: "Guest Count",   value: `${rawGuests} Guests`,                           icon: Users },
            { label: "Tradition",     value: `${rawReligion} Wedding`,                        icon: Sparkles },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="space-y-1.5 md:border-r border-white/5 last:border-0">
              <Icon className="w-4 h-4 text-primary mx-auto opacity-70" />
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground font-bold">{label}</p>
              <p className="text-base md:text-lg font-bold text-white tracking-tight">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CULTURAL CONCEPT ─── */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 bg-black/20 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2 space-y-4">
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block ${styles.accentText}`}>
              Editorial Design Concept
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
              Bespoke Cultural Profile:{" "}
              <span className={`italic bg-gradient-to-r ${styles.accentGradient} bg-clip-text text-transparent`}>
                {styles.aestheticName}
              </span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-serif italic">
              "{styles.desc} Crafted to combine luxury architectural elements with cultural authenticity."
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <h3 className={`font-display text-xl ${styles.accentText}`}>Visual Signature</h3>
            <div className="space-y-3 text-xs text-neutral-300">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Theme Colors</p>
                <p className="font-bold text-white mt-0.5">{styles.colorsList}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Atmosphere & Lighting</p>
                <p className="font-bold text-white mt-0.5">{styles.lighting}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Budget Tier</p>
                <p className={`font-bold capitalize mt-0.5 ${styles.accentText}`}>{tier} Wedding</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-28">

        {/* ══════════════════════════════════════════════════════════════════
            2. EVENT TIMELINE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Sequential Itinerary
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Wedding Timeline</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Every ceremony personalized to {rawReligion} traditions — from the first pre-wedding ritual to the grand reception.
            </p>
          </div>

          <div className="space-y-10">
            {events.map((evt, i) => (
              <div
                key={i}
                className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 bg-black/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden"
              >
                <div className={`absolute top-8 right-8 ${styles.tagBg} font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider`}>
                  Day {evt.day} · {evt.time}
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <span className={`text-[0.6rem] ${styles.accentText} uppercase tracking-[0.3em] font-bold block`}>
                    Ceremony {i + 1}
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl leading-none text-white">{evt.name}</h3>
                  <p className="text-neutral-400 font-serif italic text-lg leading-relaxed">{evt.description}</p>

                  <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span>Allocated Budget: <strong>{inr(evt.budget)}</strong></span>
                  </div>

                  <div className="h-px bg-white/5 my-2" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mandap / Stage preview */}
                    <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 group">
                      <SmartImage
                        path={evt.mandapImage}
                        alt={`${evt.name} Mandap`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        fallbackType="decor"
                      />
                    </div>
                    <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 group">
                      <SmartImage
                        path={evt.stageImage}
                        alt={`${evt.name} Stage`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        fallbackType="decor"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 group cursor-pointer" onClick={() => setSelectedImage(evt.decorImage)}>
                    <SmartImage
                      path={evt.decorImage}
                      alt={`${evt.name} Decor`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackType="decor"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all bg-black/20 flex items-center justify-center">
                      <Maximize2 className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl ${styles.tagBg} space-y-1`}>
                    <p className="text-[0.6rem] uppercase tracking-widest font-bold opacity-60">Decor Theme</p>
                    <p className="text-sm font-bold capitalize">{evt.theme} {evt.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            3. VENUE RECOMMENDATIONS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
                Matched Properties
              </span>
              <h2 className="font-display text-4xl md:text-5xl">Recommended Venues</h2>
              <p className="text-muted-foreground text-sm max-w-xl mt-2">
                Carefully selected {tier} properties in {rawState} matching your guest count of {rawGuests}.
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold ${styles.tagBg}`}>
              {venues.length} venue{venues.length !== 1 ? "s" : ""} matched
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue, i) => {
              const isSaved = savedVenues.includes(venue.name);
              return (
                <div
                  key={i}
                  className={`group glass rounded-[2.5rem] overflow-hidden border bg-black/40 hover:border-primary/45 transition-all duration-500 flex flex-col h-full ${styles.borderColor}`}
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-900 shrink-0">
                    <SmartImage
                      path={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      fallbackType="venue"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[0.65rem] font-bold text-white flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span>{venue.rating}</span>
                    </div>
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wider ${styles.tagBg}`}>
                      {tier}
                    </div>
                  </div>

                  <div className="p-8 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl text-white group-hover:text-primary transition-colors">{venue.name}</h3>
                      <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{venue.state}</span>
                      </div>
                    </div>

                    <p className="text-[0.65rem] text-neutral-400 font-serif italic line-clamp-3 leading-relaxed">
                      {venue.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Capacity</p>
                        <p className="font-bold text-white text-xs">{venue.capacity.toLocaleString()} guests</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Price Range</p>
                        <p className={`font-bold ${styles.accentText} text-xs`}>{venue.priceRange}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {venue.styles.map((s, j) => (
                        <span key={j} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[0.55rem] uppercase tracking-widest text-neutral-300">{s}</span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleVenue(venue.name, venue.name)}
                      className={`w-full py-3 mt-2 rounded-2xl border text-[0.65rem] font-black uppercase tracking-widest transition-all duration-300 ${
                        isSaved
                          ? styles.accentBg
                          : "bg-transparent border-white/10 hover:border-primary text-white hover:bg-primary hover:text-black"
                      }`}
                    >
                      {isSaved ? "✓ Saved in Shortlist" : "Shortlist Venue"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            4. DECOR INSPIRATION GALLERY
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Pinterest Moodboard
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Decor Inspirations</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Curated decor visuals for every {rawReligion} ceremony — mandaps, floral pathways, and stage designs.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {decorGallery.map((img, i) => (
              <div
                key={i}
                className={`relative group rounded-3xl overflow-hidden border bg-neutral-900 break-inside-avoid shadow-lg hover:border-primary/40 transition-all duration-500 cursor-pointer ${styles.borderColor}`}
              >
                <SmartImage
                  path={img}
                  alt={`Decor ${i + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  fallbackType="decor"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePin(img); }}
                      className={`p-3 rounded-full backdrop-blur-md border ${
                        savedImages.includes(img) ? styles.accentBg : "bg-black/60 border-white/20 text-white hover:bg-white hover:text-black"
                      } transition-all`}
                    >
                      <Heart className={`w-4 h-4 ${savedImages.includes(img) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-white">
                    <span className="text-[0.65rem] uppercase tracking-widest font-bold">Decor Reference</span>
                    <button onClick={() => setSelectedImage(img)} className={`flex items-center gap-1.5 text-xs ${styles.accentText}`}>
                      <Maximize2 className="w-3.5 h-3.5" /> View Full
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            5. OUTFIT RECOMMENDATIONS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Couture Guidelines
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Outfit Recommendations</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Curated {tier} attire for bride, groom, and couple coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Bride */}
            <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 bg-black/40 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="w-full md:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shrink-0">
                <SmartImage
                  path={outfits.bride.image}
                  alt="Bride styling"
                  className="w-full h-full object-cover"
                  fallbackType="outfit"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-center">
                <span className={`text-xs ${styles.accentText} font-bold uppercase tracking-wider`}>Bride Styling Suite</span>
                <h3 className="font-display text-3xl capitalize">{outfits.bride.type.replace("-", " ")}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-serif italic">{outfits.bride.description}</p>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold">Jewellery & Accessories</p>
                    <p className="text-xs font-bold text-neutral-200">{outfits.bride.accessories.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Groom */}
            <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 bg-black/40 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="w-full md:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shrink-0">
                <SmartImage
                  path={outfits.groom.image}
                  alt="Groom styling"
                  className="w-full h-full object-cover"
                  fallbackType="outfit"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-center">
                <span className={`text-xs ${styles.accentText} font-bold uppercase tracking-wider`}>Groom Styling Suite</span>
                <h3 className="font-display text-3xl capitalize">{outfits.groom.type.replace("-", " ")}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-serif italic">{outfits.groom.description}</p>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold">Accessories</p>
                    <p className="text-xs font-bold text-neutral-200">{outfits.groom.accessories.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Couple Coordination - full width */}
            <div className="md:col-span-2 glass rounded-[3rem] p-8 md:p-12 border border-white/10 bg-black/40 flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden bg-neutral-900 shrink-0">
                <SmartImage
                  path={outfits.couple.image}
                  alt="Couple coordination"
                  className="w-full h-full object-cover"
                  fallbackType="outfit"
                />
              </div>
              <div className="space-y-4">
                <span className={`text-xs ${styles.accentText} font-bold uppercase tracking-wider`}>Couple Coordination</span>
                <h3 className="font-display text-3xl capitalize">{outfits.couple.style} Coordination</h3>
                <p className="text-sm text-neutral-400 font-serif italic">
                  A perfectly matched couple ensemble in the <strong>{outfits.couple.style}</strong> style — 
                  bride in {outfits.bride.type.replace("-", " ")} and groom in {outfits.groom.type.replace("-", " ")}, 
                  creating a visually harmonious {tier} wedding aesthetic.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className={`p-3 rounded-xl ${styles.tagBg}`}>
                    <p className="text-[0.55rem] uppercase tracking-widest font-bold opacity-60 mb-1">Bride</p>
                    <p className="text-xs font-bold capitalize">{outfits.bride.type.replace("-", " ")}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${styles.tagBg}`}>
                    <p className="text-[0.55rem] uppercase tracking-widest font-bold opacity-60 mb-1">Groom</p>
                    <p className="text-xs font-bold capitalize">{outfits.groom.type.replace("-", " ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            6. BUDGET BREAKDOWN
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Financial Summary
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Budget Breakdown</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Realistic allocation for a {tier} {rawReligion} wedding with {rawGuests} guests in {rawState}.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Bar chart */}
            <div className="glass rounded-[2.5rem] p-8 border border-white/10 bg-black/40 space-y-5">
              <h3 className="font-display text-2xl mb-2">Allocation Chart</h3>
              {budgetLines.map(({ category, pct, amount }) => (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-neutral-200">{category}</span>
                    <span className={`font-black ${styles.accentText}`}>{inr(amount)} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${styles.accentGradient} transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary cards */}
            <div className="space-y-4">
              <div className="glass rounded-[2.5rem] p-8 border border-white/10 bg-black/40 space-y-4">
                <h3 className="font-display text-2xl">Total Investment</h3>
                <p className={`font-black text-5xl bg-gradient-to-r ${styles.accentGradient} bg-clip-text text-transparent`}>
                  {inr(rawBudget)}
                </p>
                <p className="text-xs text-neutral-400">
                  <span className={`capitalize font-bold ${styles.accentText}`}>{tier}</span> tier · {rawGuests} guests · {rawState}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {budgetLines.slice(0, 4).map(({ category, amount }) => (
                  <div key={category} className="glass rounded-2xl p-5 border border-white/5 bg-black/30 space-y-1">
                    <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground font-bold">{category}</p>
                    <p className={`text-lg font-black ${styles.accentText}`}>{inr(amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            7. CULINARY EXPERIENCE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Gourmet Catering
            </span>
            <h2 className="font-display text-4xl md:text-5xl">{styles.menuTitle}</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Curated menus tailored to {rawReligion} traditions and {tier} standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Live Stations", items: styles.menuItems.counters },
              { title: "Main Course", items: styles.menuItems.mains },
              { title: "Beverages", items: styles.menuItems.drinks },
            ].map(({ title, items }) => (
              <div key={title} className="glass rounded-[2.5rem] p-8 border border-white/10 bg-black/40 space-y-4">
                <Utensils className="w-6 h-6 text-primary mb-2" />
                <h4 className={`font-display text-2xl ${styles.accentText}`}>{title}</h4>
                <ul className="space-y-3">
                  {items.map((item, j) => (
                    <li key={j} className="flex gap-2 text-sm text-neutral-300">
                      <span className="text-primary">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            8. RECOMMENDED SERVICES
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Luxury Collaborations
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Recommended Services</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Curated {tier} vendors matched to your budget, religion, and theme.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Photographers", icon: Camera, key: "photographer" },
              { title: "Decorators",    icon: Award,  key: "decorator" },
              { title: "Makeup Artists",icon: Users,  key: "makeup" },
              { title: "Caterers",      icon: Utensils,key: "caterer" },
            ].map(({ title, icon: Icon, key }) => {
              const items = getServices(key);
              return (
                <div key={key} className="glass rounded-[2.5rem] p-6 border border-white/10 bg-black/40 space-y-6 flex flex-col h-full">
                  <h3 className="font-display text-2xl flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" /> {title}
                  </h3>
                  <div className="space-y-4 flex-1">
                    {items.length === 0 && (
                      <p className="text-xs text-neutral-500 italic">No vendors found for your region.</p>
                    )}
                    {items.map((item, j) => (
                      <div key={j} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3 hover:border-white/15 transition-colors">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
                          <SmartImage
                            path={item.image || item.coverImage || "/assets/fallback/cover.webp"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            fallbackType="default"
                          />
                          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 text-primary fill-primary" />
                            <span>{item.rating || 4.5}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{item.name}</p>
                          <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">{item.city || item.state}</p>
                        </div>
                        <p className="text-[0.65rem] text-neutral-400 font-serif italic line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-[0.65rem] font-bold text-neutral-300">{item.priceRange}</span>
                          <button
                            onClick={() => setSelectedVendor(item)}
                            className={`text-[0.65rem] font-black uppercase tracking-widest ${styles.accentText} hover:underline`}
                          >
                            View Portfolio
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            9. MASTER CHECKLIST
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Planning Vault
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Master Checklist</h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2">
              Your step-by-step planning guide for a {rawReligion} {tier} wedding.
            </p>
          </div>
          <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 bg-black/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {styles.checklist.map((task, i) => (
                <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${styles.tagBg}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            10. PHOTOGRAPHY TIPS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          <div>
            <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-black block mb-2 ${styles.accentText}`}>
              Visual Framing
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Photography & Cinematic Guide</h2>
          </div>
          <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 bg-black/40 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className={`font-serif italic text-lg text-neutral-300 leading-relaxed`}>"{styles.photoTips}"</p>
              <div className="space-y-4">
                {[
                  { title: "Color Grading Profile", desc: `Tuned to accentuate the ${styles.colorsList} palette.` },
                  { title: "Drone Setup", desc: "Top-down framing of outdoor lawns, mandap structures, and courtyard ceremonies." },
                  { title: "Candid Coverage", desc: "Documentary-style emotional captures during rituals, vows, and family moments." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <ChevronRight className={`w-4 h-4 ${styles.accentText} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-xs font-bold ${styles.accentText} uppercase tracking-widest`}>{title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use decor gallery images for photography preview */}
            <div className="grid grid-cols-2 gap-4">
              {decorGallery.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl overflow-hidden bg-neutral-900 ${i === 1 ? "mt-6" : ""} group cursor-pointer`}
                  onClick={() => setSelectedImage(img)}
                >
                  <SmartImage
                    path={img}
                    alt={`Photo style ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackType="decor"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
