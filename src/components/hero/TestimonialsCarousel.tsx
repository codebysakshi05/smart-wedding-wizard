import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

const TESTIMONIALS = [
  {
    name: "Priya & Arjun Mehta",
    location: "Mumbai, Maharashtra",
    ceremony: "Hindu Wedding · 3-Day Celebration",
    quote:
      "Dream Weaver AI planned our entire wedding in minutes — the venue suggestions were spot on, the timeline was flawless. Our guests are still talking about it. Truly magical.",
    rating: 5,
    avatar: "PM",
    color: "from-rose-900/40 to-amber-900/20",
  },
  {
    name: "Fatima & Zaid Khan",
    location: "Hyderabad, Telangana",
    ceremony: "Muslim Wedding · Nikah & Walima",
    quote:
      "The AI understood every detail of our Nikah — from the décor palette to the menu. It felt like a personal wedding consultant who truly knew our culture and taste.",
    rating: 5,
    avatar: "FZ",
    color: "from-emerald-900/40 to-teal-900/20",
  },
  {
    name: "Ananya & Rohan Nair",
    location: "Kochi, Kerala",
    ceremony: "South Indian Wedding · Muhurtham",
    quote:
      "We got a beautifully detailed South Indian wedding plan — complete with Kanjeevaram styling recommendations, venue shortlist, and a comprehensive budget. Absolutely stunning.",
    rating: 5,
    avatar: "AR",
    color: "from-amber-900/40 to-yellow-900/20",
  },
  {
    name: "Simran & Harjot Singh",
    location: "Amritsar, Punjab",
    ceremony: "Sikh Wedding · Anand Karaj",
    quote:
      "The 3-day Anand Karaj plan was so detailed — it included Jaggo, Maiyan, and the final ceremony with stage decor ideas and catering recommendations. Exceptional!",
    rating: 5,
    avatar: "SH",
    color: "from-orange-900/40 to-red-900/20",
  },
  {
    name: "Rebecca & Samuel D'Souza",
    location: "Goa",
    ceremony: "Christian Wedding · Church & Reception",
    quote:
      "Planning a beach wedding in Goa felt overwhelming until Dream Weaver AI generated our complete plan in seconds. The venue suggestions were beyond perfect.",
    rating: 5,
    avatar: "RS",
    color: "from-blue-900/40 to-indigo-900/20",
  },
];

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const t = TESTIMONIALS[active];

  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(6,4,2,0.72)", backdropFilter: "blur(2px)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-8 blur-3xl pointer-events-none"
        style={{ background: GOLD }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span
              className="text-[0.65rem] uppercase tracking-[0.4em] font-black"
              style={{
                background: GOLD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Love Stories
            </span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h2 className="font-display text-5xl md:text-7xl text-white">
            Weddings That{" "}
            <span
              className="italic"
              style={{
                background: GOLD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Moved Hearts
            </span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`relative rounded-[3rem] p-10 md:p-14 border border-white/10 bg-gradient-to-br ${t.color}`}
              style={{
                backdropFilter: "blur(20px)",
                background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`,
                boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              }}
            >
              {/* Quote icon */}
              <Quote className="w-12 h-12 mb-8 opacity-20" style={{ color: "#c9994a" }} />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-serif italic text-xl md:text-2xl text-white/85 leading-relaxed mb-10">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-5 border-t border-white/10 pt-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-black shrink-0"
                  style={{ background: GOLD }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{t.name}</p>
                  <p className="text-xs text-white/50">{t.location}</p>
                  <p
                    className="text-[0.6rem] uppercase tracking-widest mt-1 font-bold"
                    style={{
                      background: GOLD,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t.ceremony}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => go(-1)}
              className="w-12 h-12 rounded-full border border-white/15 hover:border-amber-400/40 flex items-center justify-center text-white/50 hover:text-amber-400 transition-all duration-300 hover:bg-amber-400/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === active ? 24 : 6,
                    height: 6,
                    background:
                      i === active
                        ? "linear-gradient(135deg,#f5d98a,#c9994a)"
                        : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-12 h-12 rounded-full border border-white/15 hover:border-amber-400/40 flex items-center justify-center text-white/50 hover:text-amber-400 transition-all duration-300 hover:bg-amber-400/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
