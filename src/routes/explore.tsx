import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Crown,
  Waves,
  Trees,
  Building2,
  Mountain,
  Flower2,
  Star,
  Filter,
  Heart,
} from "lucide-react";
import { CURATED_JOURNEYS } from "@/data/curatedJourneys";
import { INDIAN_STATES } from "@/data/weddingData";
import {
  getDecorImage,
  getVenueImage,
  getFallbackImage,
  getCategoryImage,
} from "@/utils/imageResolver";
import SmartImage from "@/components/ui/SmartImage";
import { motion } from "motion/react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Weddings — Dream Weaver AI" },
      {
        name: "description",
        content:
          "Discover breathtaking wedding venues, decor styles, and ceremonial themes across India. Your perfect wedding begins here.",
      },
    ],
  }),
  component: DiscoveryPage,
});

const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

const FILTER_PILLS = [
  { label: "All", value: "all", Icon: Sparkles },
  { label: "Royal", value: "royal", Icon: Crown },
  { label: "Beach", value: "beach", Icon: Waves },
  { label: "Nature", value: "nature", Icon: Trees },
  { label: "Modern", value: "modern", Icon: Building2 },
  { label: "Mountain", value: "mountain", Icon: Mountain },
  { label: "Floral", value: "floral", Icon: Flower2 },
];

const RELIGION_FILTERS = [
  { label: "All Religions", value: "all" },
  { label: "🪔 Hindu", value: "hindu" },
  { label: "🌙 Muslim", value: "muslim" },
  { label: "⛪ Christian", value: "christian" },
  { label: "🪬 Sikh", value: "sikh" },
  { label: "🌸 South Indian", value: "south" },
];

const TOP_STATES = [
  { name: "Rajasthan", desc: "Palaces & Forts", image: getVenueImage("rajasthan", "premium") },
  { name: "Goa", desc: "Beach Resorts", image: getVenueImage("goa", "premium") },
  { name: "Kerala", desc: "Scenic Backwaters", image: getVenueImage("kerala", "premium") },
  { name: "Karnataka", desc: "Heritage Temples", image: getVenueImage("karnataka", "premium") },
  { name: "Tamil Nadu", desc: "Cultural Grandeur", image: getVenueImage("tamil-nadu", "premium") },
  { name: "Delhi", desc: "Luxury Farmhouses", image: getVenueImage("delhi", "premium") },
  { name: "Maharashtra", desc: "Modern & Classic", image: getVenueImage("maharashtra", "premium") },
  { name: "Punjab", desc: "Vibrant & Lavish", image: getVenueImage("punjab", "premium") },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px w-8" style={{ background: GOLD }} />
      <span
        className="text-[0.65rem] uppercase tracking-[0.4em] font-black"
        style={{
          background: GOLD,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function DiscoveryPage() {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState("");
  const [searchTheme, setSearchTheme] = useState("");
  const [activeStyle, setActiveStyle] = useState("all");
  const [activeReligion, setActiveReligion] = useState("all");
  const [likedJourneys, setLikedJourneys] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedJourneys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePlanWedding = (stateStr?: string, themeStr?: string) => {
    sessionStorage.setItem(
      "quiz_answers_prefill",
      JSON.stringify({
        state: stateStr || searchState || "Rajasthan",
        theme: themeStr || searchTheme || "Royal",
      }),
    );
    navigate({ to: "/plan" });
  };

  const filteredJourneys = useMemo(() => {
    return CURATED_JOURNEYS.filter((j) => {
      const styleMatch =
        activeStyle === "all" ||
        (j.theme || "").toLowerCase().includes(activeStyle) ||
        (j.name || "").toLowerCase().includes(activeStyle);
      const religionMatch =
        activeReligion === "all" || (j.religion || "").toLowerCase().includes(activeReligion);
      return styleMatch && religionMatch;
    });
  }, [activeStyle, activeReligion]);

  return (
    <Layout>
      {/* ── CINEMATIC HERO ── */}
      <section className="relative h-[88vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage
            path="/assets/explore_bg.png"
            alt="Wedding Hero"
            className="w-full h-full object-cover scale-105 animate-slow-pan"
            fallbackType="venue"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-neutral-950" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(201,153,74,0.15), transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center space-y-10 mt-20">
          <motion.div {...fadeUp(0)} className="space-y-5">
            <span
              className="inline-block py-1.5 px-5 rounded-full border border-amber-400/30 text-[0.65rem] uppercase tracking-[0.35em] font-black"
              style={{ background: "rgba(201,153,74,0.08)", color: "#e8c870" }}
            >
              ✦ Premium Wedding Discovery ✦
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white leading-[0.95] drop-shadow-2xl">
              Find Your Dream{" "}
              <span
                className="italic block"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Wedding Style
              </span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto font-serif italic">
              Explore thousands of real weddings, venues, and inspirations — then let our AI craft
              your perfect ceremony in seconds.
            </p>
          </motion.div>

          {/* ── SEARCH BAR ── */}
          <motion.div {...fadeUp(0.15)}>
            <div
              className="flex flex-col md:flex-row items-center gap-0 max-w-3xl mx-auto rounded-full overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              style={{ background: "rgba(6,4,1,0.75)", backdropFilter: "blur(32px)" }}
            >
              <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-white/10">
                <MapPin className="text-amber-400 w-4 h-4 shrink-0" />
                <select
                  className="bg-transparent border-none text-white/80 outline-none w-full cursor-pointer appearance-none text-sm"
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                >
                  <option value="" className="text-black bg-neutral-900">
                    Any Destination
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s} className="text-black bg-neutral-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-white/10">
                <Sparkles className="text-amber-400 w-4 h-4 shrink-0" />
                <select
                  className="bg-transparent border-none text-white/80 outline-none w-full cursor-pointer appearance-none text-sm"
                  value={searchTheme}
                  onChange={(e) => setSearchTheme(e.target.value)}
                >
                  <option value="" className="text-black bg-neutral-900">
                    Any Theme
                  </option>
                  <option value="Royal" className="text-black bg-neutral-900">
                    Royal Palace
                  </option>
                  <option value="Beach" className="text-black bg-neutral-900">
                    Beach Sunset
                  </option>
                  <option value="Temple" className="text-black bg-neutral-900">
                    Temple Traditional
                  </option>
                  <option value="Modern" className="text-black bg-neutral-900">
                    Modern Minimalist
                  </option>
                  <option value="Mountain" className="text-black bg-neutral-900">
                    Mountain Retreat
                  </option>
                  <option value="Floral" className="text-black bg-neutral-900">
                    Floral Fantasy
                  </option>
                </select>
              </div>
              <button
                onClick={() => handlePlanWedding()}
                className="w-full md:w-auto px-8 py-4 font-bold uppercase tracking-widest text-xs text-black transition-all hover:brightness-110 whitespace-nowrap flex items-center gap-2 justify-center"
                style={{ background: GOLD }}
              >
                <Search className="w-4 h-4" /> Explore Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
          <div className="w-px h-8" style={{ background: GOLD }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
        </div>
      </section>

      {/* ── TOP DESTINATIONS GRID ── */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeUp()} className="mb-14">
          <SectionLabel>28 Indian States</SectionLabel>
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <h2 className="font-display text-5xl md:text-6xl text-white">
              Top{" "}
              <span
                className="italic"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Destinations
              </span>
            </h2>
            <p className="text-white/50 max-w-sm text-sm font-serif italic">
              From royal palaces of Rajasthan to the serene backwaters of Kerala — every backdrop is
              extraordinary.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {TOP_STATES.map((state, i) => (
            <motion.button
              key={i}
              {...fadeUp(i * 0.05)}
              onClick={() => handlePlanWedding(state.name, undefined)}
              className="group relative rounded-[2rem] overflow-hidden aspect-[3/4] flex items-end p-6 text-left cursor-pointer border border-white/5 hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <SmartImage
                path={state.image}
                alt={state.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                fallbackType="venue"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, rgba(201,153,74,0.2), transparent 60%)",
                }}
              />
              <div className="relative z-10">
                <h3 className="font-display text-2xl text-white group-hover:text-amber-300 transition-colors">
                  {state.name}
                </h3>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">{state.desc}</p>
                <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                  <span
                    className="text-[0.6rem] uppercase tracking-widest font-black"
                    style={{
                      background: GOLD,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Plan Here
                  </span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── TRENDING STYLES with FILTERS ── */}
      <section className="py-28 px-6" style={{ background: "rgba(6,4,2,0.6)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <SectionLabel>AI Curated</SectionLabel>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
              <h2 className="font-display text-5xl md:text-6xl text-white">
                Wedding{" "}
                <span
                  className="italic"
                  style={{
                    background: GOLD,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Journeys
                </span>
              </h2>
              <p className="text-white/50 max-w-sm text-sm font-serif italic">
                Curated aesthetic journeys designed by top wedding architects, powered by AI.
              </p>
            </div>

            {/* Filter Rows */}
            <div className="space-y-4">
              {/* Style Filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-white/30">
                  <Filter className="w-3.5 h-3.5" /> Style:
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {FILTER_PILLS.map((pill) => (
                    <button
                      key={pill.value}
                      onClick={() => setActiveStyle(pill.value)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.65rem] uppercase tracking-widest font-bold border transition-all duration-300"
                      style={{
                        background: activeStyle === pill.value ? GOLD : "rgba(255,255,255,0.04)",
                        borderColor:
                          activeStyle === pill.value ? "transparent" : "rgba(255,255,255,0.08)",
                        color: activeStyle === pill.value ? "#000" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      <pill.Icon className="w-3 h-3" />
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Religion Filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-white/30">
                  <Sparkles className="w-3.5 h-3.5" /> Religion:
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {RELIGION_FILTERS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setActiveReligion(r.value)}
                      className="px-4 py-2 rounded-full text-[0.65rem] uppercase tracking-widest font-bold border transition-all duration-300"
                      style={{
                        background:
                          activeReligion === r.value
                            ? "rgba(201,153,74,0.12)"
                            : "rgba(255,255,255,0.03)",
                        borderColor:
                          activeReligion === r.value
                            ? "rgba(201,153,74,0.4)"
                            : "rgba(255,255,255,0.08)",
                        color: activeReligion === r.value ? "#e8c870" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards Grid */}
          {filteredJourneys.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-display text-2xl">No journeys match your filters</p>
              <p className="text-sm mt-2">Try selecting a different style or religion.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJourneys.map((journey, i) => (
                <motion.div
                  key={journey.id}
                  {...fadeUp(i * 0.06)}
                  className="group relative rounded-[2.5rem] overflow-hidden border border-white/8 hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-neutral-900 shrink-0">
                    <SmartImage
                      path={journey.heroImage || getFallbackImage()}
                      alt={journey.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      fallbackType="default"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-widest font-bold border border-amber-400/30"
                        style={{ background: "rgba(201,153,74,0.12)", color: "#e8c870" }}
                      >
                        {journey.religion}
                      </span>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(journey.id);
                      }}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center transition-all hover:border-rose-400/50 hover:bg-rose-500/10"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          likedJourneys.has(journey.id)
                            ? "fill-rose-400 text-rose-400"
                            : "text-white/50"
                        }`}
                      />
                    </button>

                    {/* Stars */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex-1 space-y-3">
                      <h3 className="font-display text-2xl text-white group-hover:text-amber-300 transition-colors">
                        {journey.name}
                      </h3>
                      <p className="text-sm text-white/50 font-serif italic line-clamp-2 leading-relaxed">
                        {journey.description}
                      </p>
                      {journey.location && (
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          <MapPin className="w-3 h-3 text-amber-400/60" />
                          {journey.location}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/8 flex justify-between items-center">
                      <div>
                        <p className="text-[0.55rem] uppercase tracking-widest text-white/30">
                          Theme
                        </p>
                        <p
                          className="text-xs font-bold capitalize"
                          style={{
                            background: GOLD,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {journey.theme || "Luxury"}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePlanWedding(journey.location, journey.theme)}
                        className="group/btn flex items-center gap-2 text-[0.65rem] uppercase tracking-widest font-black px-5 py-2.5 rounded-full border border-amber-400/20 text-amber-400 hover:bg-amber-400 hover:text-black hover:border-transparent transition-all duration-300"
                      >
                        Plan This
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-28 px-6">
        <motion.div {...fadeUp()} className="max-w-4xl mx-auto text-center relative">
          <div
            className="absolute inset-0 rounded-[4rem] blur-[120px] opacity-15 -z-10"
            style={{ background: GOLD }}
          />
          <div
            className="rounded-[3rem] p-14 md:p-20 border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
          >
            <SectionLabel>Begin Your Story</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6 leading-tight">
              Ready to Plan{" "}
              <span
                className="italic"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your Wedding?
              </span>
            </h2>
            <p className="text-white/60 font-serif italic mb-12 max-w-xl mx-auto">
              A 60-second AI quiz unlocks a complete luxury wedding plan — venues, timelines,
              outfits, and more.
            </p>
            <Link
              to="/plan"
              className="group relative inline-flex items-center gap-3 rounded-full px-12 py-5 text-sm uppercase tracking-[0.3em] font-black text-black transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(201,153,74,0.5)] overflow-hidden"
              style={{ background: GOLD }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 pointer-events-none" />
              <Sparkles className="w-5 h-5 relative" />
              <span className="relative">Start Planning Now</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
