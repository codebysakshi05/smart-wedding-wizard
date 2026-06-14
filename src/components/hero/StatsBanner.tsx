import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

const STATS = [
  { value: 500, suffix: "+", label: "Premium Venues", sublabel: "Across 28 States" },
  { value: 12000, suffix: "+", label: "Weddings Planned", sublabel: "This Year Alone" },
  { value: 5, suffix: " Religions", label: "Ceremonies Supported", sublabel: "Every Tradition" },
  { value: 98, suffix: "%", label: "Couple Satisfaction", sublabel: "5-Star Experiences" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function StatsBanner() {
  return (
    <section
      className="relative py-20 border-y border-white/5 overflow-hidden"
      style={{ background: "rgba(201,153,74,0.03)" }}
    >
      {/* Gold shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: GOLD, opacity: 0.25 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: GOLD, opacity: 0.25 }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="text-center group"
            >
              <p
                className="font-display text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white font-bold text-sm uppercase tracking-wider">{stat.label}</p>
              <p className="text-white/40 text-xs mt-1 tracking-widest">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
