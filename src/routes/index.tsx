import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  Camera,
  Palette,
  Crown,
  Compass,
  Shirt,
  Utensils,
  Music,
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { LuxuryGlow } from "@/components/hero/LuxuryGlow";
import CinematicHero from "@/components/hero/CinematicHero";
import TestimonialsCarousel from "@/components/hero/TestimonialsCarousel";
import StatsBanner from "@/components/hero/StatsBanner";
import { motion } from "motion/react";
import {
  getVenueImage,
  getDecorImage,
  getOutfitImage,
  getServiceImage,
  getFoodImage,
  getFallbackImage,
} from "@/utils/assets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Wedding Wizard â€” The Art of Wedding Planning" },
      {
        name: "description",
        content:
          "Experience the future of luxury Indian wedding planning. AI-driven precision for every celebration.",
      },
    ],
  }),
  component: Index,
} as any);

const CATEGORIES = [
  {
    id: "venues",
    icon: Crown,
    title: "Palatial Venues",
    desc: "Royal palaces, beach resorts & grand ballrooms",
    img: getVenueImage("rajasthan", "premium"),
    count: "500+ Venues",
  },
  {
    id: "decor",
    icon: Palette,
    title: "Artisanal Decor",
    desc: "Bespoke floral, mandap & lighting setups",
    img: getDecorImage("wedding", "premium"),
    count: "2000+ IDEAS",
  },
  {
    id: "outfits",
    icon: Shirt,
    title: "Bridal Couture",
    desc: "Designer lehengas, sherwanis & cultural attire",
    img: getOutfitImage("bride"),
    count: "800+ Styles",
  },
  {
    id: "catering",
    icon: Utensils,
    title: "Grand Catering",
    desc: "Multi-cuisine feasts, live counters & luxury dining",
    img: getFoodImage("luxury-dining"),
    count: "200+ Menus",
  },
  {
    id: "invitation",
    icon: Music,
    title: "Live Entertainment",
    desc: "Bands, DJs, celebrity performers & fireworks",
    img: getServiceImage("dj", "premium"),
    count: "300+ Artists",
  },
];

const RELIGIONS = [
  {
    name: "Hindu",
    emoji: "🪔",
    events: "Haldi · Mehndi · Sangeet · Saptapadi",
    from: "#7f1d1d",
    to: "#92400e",
  },
  {
    name: "Muslim",
    emoji: "🌙",
    events: "Mehndi · Mangni · Nikah · Walima",
    from: "#064e3b",
    to: "#1e3a5f",
  },
  {
    name: "Christian",
    emoji: "⛪",
    events: "Bridal Shower · Church Wedding · Reception",
    from: "#1e293b",
    to: "#334155",
  },
  {
    name: "Sikh",
    emoji: "🪬",
    events: "Maiyan · Jaggo · Anand Karaj · Reception",
    from: "#78350f",
    to: "#713f12",
  },
  {
    name: "South Indian",
    emoji: "🌸",
    events: "Vrutham · Muhurtham · Grand Sadya",
    from: "#14532d",
    to: "#713f12",
  },
];

const GOLD = "linear-gradient(135deg,#e8c870 0%,#c9994a 100%)";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: "easeOut" as const },
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

function Index() {
  const [featuredVenues, setFeaturedVenues] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/venues.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => {
        let arr: any[] = [];
        if (!Array.isArray(d)) {
          Object.values(d).forEach((stateObj: any) => {
            Object.values(stateObj).forEach((budgetArr: any) => {
              if (Array.isArray(budgetArr)) arr.push(...budgetArr);
            });
          });
        } else {
          arr = d;
        }
        arr = arr.map((v: any) => {
          if (v.coverImage)
            v.coverImage = v.coverImage.replace(/\/cover\.(jpg|jpeg|png|webp|avif)$/i, "");
          if (v.localImagePath)
            v.localImagePath = v.localImagePath.replace(/\/cover\.(jpg|jpeg|png|webp|avif)$/i, "");
          return v;
        });
        setFeaturedVenues(arr.filter((v) => v?.rating >= 4.7).slice(0, 3));
      })
      .catch(() => {});

    fetch("/data/services.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => {
        let arr: any[] = [];
        if (!Array.isArray(d)) {
          Object.values(d).forEach((catObj: any) => {
            Object.values(catObj).forEach((budgetArr: any) => {
              if (Array.isArray(budgetArr)) arr.push(...budgetArr);
            });
          });
        } else {
          arr = d;
        }
        arr = arr.map((s: any) => {
          if (s.coverImage)
            s.coverImage = s.coverImage.replace(/\/cover\.(jpg|jpeg|png|webp|avif)$/i, "");
          return s;
        });
        setFeaturedServices(arr.filter((s) => s?.rating >= 4.8).slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <Layout fullBleed>
      {/* ── HERO ── */}
      <CinematicHero />

      {/* ── CATEGORIES ── */}
      <section
        className="relative py-28 md:py-40 overflow-hidden"
        style={{ background: "rgba(0,0,0,0.48)", backdropFilter: "blur(2px)" }}
      >
        <LuxuryGlow className="top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <SectionLabel>Popular Categories</SectionLabel>
            <h2 className="font-display text-5xl md:text-7xl mb-5">
              Everything For Your{" "}
              <span
                className="italic"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Perfect Day
              </span>
            </h2>
            <p className="text-white/72 font-serif italic text-lg">
              Explore 5 dimensions of luxury wedding planning, curated by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.a
                key={cat.id}
                href="/plan"
                {...fadeUp(i * 0.07)}
                className="group relative rounded-3xl overflow-hidden border border-white/18 hover:border-amber-400/50 transition-all duration-500 cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <SmartImage
                    path={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    fallbackType="default"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                      style={{
                        background: "rgba(201,153,74,0.2)",
                        border: "1px solid rgba(201,153,74,0.4)",
                      }}
                    >
                      <cat.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm leading-tight mb-1">{cat.title}</h3>
                    <p className="text-[0.6rem] text-amber-400 font-bold uppercase tracking-widest">
                      {cat.count}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section
        className="relative py-28 md:py-40"
        style={{ background: "rgba(5,4,2,0.55)", backdropFilter: "blur(2px)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <SectionLabel>The Process</SectionLabel>
            <h2 className="font-display text-5xl md:text-7xl">
              Three Steps to{" "}
              <span
                className="italic"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Magic
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                n: "01",
                t: "The Vision",
                d: "Share budget, religion & dreams via our 60-second AI quiz.",
                icon: Palette,
              },
              {
                n: "02",
                t: "The Curation",
                d: "AI orchestrates venues, day-wise timelines & royal attire.",
                icon: Crown,
              },
              {
                n: "03",
                t: "The Masterpiece",
                d: "Refine your board, save inspirations & celebrate grandly.",
                icon: Sparkles,
              },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp(i * 0.2)}
                className="relative group p-8 rounded-3xl border border-white/12 hover:border-amber-400/30 transition-all duration-500"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <span
                  className="font-display text-7xl italic absolute -top-8 -left-2 select-none"
                  style={{
                    background: GOLD,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    opacity: 0.12,
                  }}
                >
                  {s.n}
                </span>
                <s.icon className="w-8 h-8 mb-6 text-amber-400" />
                <h3 className="font-display text-2xl mb-3 text-white">{s.t}</h3>
                <p className="text-white/72 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <StatsBanner />

      {/* ── CULTURAL MASTERY ── */}
      <section
        className="relative py-28 md:py-40 overflow-hidden"
        style={{ background: "rgba(0,0,0,0.50)" }}
      >
        <LuxuryGlow className="bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[700px] h-[700px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div {...fadeUp()}>
                <SectionLabel>Cultural Excellence</SectionLabel>
                <h2 className="font-display text-5xl md:text-6xl mb-6">
                  Mastering Every{" "}
                  <span
                    className="italic"
                    style={{
                      background: GOLD,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Ritual
                  </span>
                </h2>
                <p className="text-white/70 font-serif italic text-lg mb-10">
                  From sacred Agni of Hindu weddings to the elegant Nikah of the Nizams â€” we
                  understand your tradition.
                </p>
              </motion.div>
              <div className="space-y-3">
                {RELIGIONS.map((r, i) => (
                  <motion.div
                    key={r.name}
                    {...fadeUp(i * 0.1)}
                    className="group flex items-center justify-between p-5 rounded-2xl border border-white/12 hover:border-amber-400/35 transition-all duration-500 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${r.from}33, ${r.to}22)` }}
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-400">
                        {r.emoji}
                      </span>
                      <div>
                        <h4 className="font-display italic text-lg text-white font-medium">
                          {r.name}
                        </h4>
                        <p className="text-[0.6rem] uppercase tracking-widest text-white/60">
                          {r.events}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400" />
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div {...fadeUp(0.3)} className="relative group">
              <div
                className="absolute inset-0 rounded-[3rem] blur-[80px] opacity-30"
                style={{ background: GOLD }}
              />
              <div className="relative rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <SmartImage
                    path={getDecorImage("wedding", "premium")}
                    alt="Cultural Weddings"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-[0.55rem] uppercase tracking-[0.4em] font-black mb-2 text-amber-400">
                    Live Curation
                  </p>
                  <h3 className="font-display text-3xl italic text-white">The Sacred Vows</h3>
                  <p className="text-white/50 text-sm mt-1">28 Indian states. Every tradition.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsCarousel />

      {/* ── FINAL CTA ── */}
      <section className="py-28 md:py-40 px-6" style={{ background: "rgba(5,4,2,0.58)" }}>
        <motion.div {...fadeUp()} className="max-w-4xl mx-auto text-center relative">
          <div
            className="absolute inset-0 rounded-[4rem] blur-[120px] opacity-20 -z-10"
            style={{ background: GOLD }}
          />
          <div
            className="rounded-[4rem] p-16 md:p-24 border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
          >
            <Compass className="w-12 h-12 mx-auto mb-10 text-amber-400 animate-spin-slow" />
            <h2 className="font-display text-5xl md:text-7xl mb-8 leading-tight">
              Start Your{" "}
              <span
                className="italic"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Wedding Odyssey
              </span>
            </h2>
            <p className="text-white/75 text-xl font-serif italic mb-14 max-w-xl mx-auto">
              A 60-second quiz to unlock a cinematic world of venues, decor & timelines tailored to
              your love story.
            </p>
            <Link
              to="/plan"
              className="group relative inline-flex items-center gap-4 rounded-full px-14 py-6 text-sm uppercase tracking-[0.35em] font-black text-black overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(201,153,74,0.5)]"
              style={{ background: GOLD }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
              <span className="relative">Plan My Wedding</span>
              <ArrowRight className="w-5 h-5 relative group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}

export default Index;
