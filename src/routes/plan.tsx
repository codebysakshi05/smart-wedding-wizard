import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { LoadingScreen } from "@/components/LoadingScreen";
import SmartImage from "@/components/ui/SmartImage";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "AI Wedding Planner — Dream Weaver AI" },
      {
        name: "description",
        content:
          "Tell us your love story and our AI will craft a cinematic wedding plan in minutes.",
      },
      { property: "og:title", content: "AI Wedding Planner — Dream Weaver AI" },
      {
        property: "og:description",
        content: "Build your personalized luxury AI wedding plan in minutes.",
      },
    ],
  }),
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        throw redirect({
          to: "/login",
          search: { redirect: location.href },
        });
      }
    }
  },
  component: PlanPage,
});

import { INDIAN_STATES, RELIGIONS, THEMES, PRIORITIES, BUDGET_TIERS } from "@/data/weddingData";

import { CalendarDays } from "lucide-react";

const steps = [
  { label: "Details", icon: CalendarDays },
  { label: "Budget", icon: Wallet },
  { label: "Guests", icon: Users },
  { label: "Religion", icon: BookOpen },
  { label: "Vibe", icon: Paintbrush },
  { label: "Priorities", icon: Heart },
] as const;

function PlanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [coupleNames, setCoupleNames] = useState("The Happy Couple");
  const [loveStory, setLoveStory] = useState("");
  const [weddingDate, setWeddingDate] = useState("2026-12-01");
  const [budget, setBudget] = useState(500000);
  const [guests, setGuests] = useState(200);
  const [religion, setReligion] = useState("Hindu");
  const [theme, setTheme] = useState("Royal");
  const [state, setState] = useState("Rajasthan");
  const [priorities, setPriorities] = useState<string[]>(["luxury_decor"]);
  const [generating, setGenerating] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlState = params.get("state");
      const urlTheme = params.get("theme");
      const urlReligion = params.get("religion");
      const urlBudget = params.get("budget");

      if (urlState) {
        const matched = INDIAN_STATES.find((s) => s.toLowerCase() === urlState.toLowerCase());
        if (matched) {
          setState(matched);
        } else {
          setState(urlState); // Fallback to provided string
        }
      }

      if (urlTheme) {
        const matched = THEMES.find((t) => t.name.toLowerCase() === urlTheme.toLowerCase());
        if (matched) {
          setTheme(matched.name);
        } else {
          setTheme(urlTheme);
        }
      }

      if (urlReligion) {
        const matched = RELIGIONS.find((r) => r.name.toLowerCase() === urlReligion.toLowerCase());
        if (matched) {
          setReligion(matched.name);
        }
      }

      if (urlBudget) {
        if (urlBudget === "premium" || urlBudget === "high") {
          setBudget(2500000);
        } else if (urlBudget === "mid") {
          setBudget(1000000);
        } else if (urlBudget === "budget") {
          setBudget(450000);
        }
      }

      // Check prefill from explore
      const prefill = sessionStorage.getItem("quiz_answers_prefill");
      if (prefill) {
        try {
          const p = JSON.parse(prefill);
          if (p.state) setState(p.state);
          if (p.theme) setTheme(p.theme.charAt(0).toUpperCase() + p.theme.slice(1));
          if (p.religion) {
            const matched = RELIGIONS.find(
              (r) =>
                r.name.toLowerCase() === p.religion.toLowerCase() ||
                (p.religion.includes("-") &&
                  r.name.toLowerCase().replace(" ", "-") === p.religion.toLowerCase()),
            );
            if (matched) setReligion(matched.name);
          }
          setIsPrefilled(true);
          setStep(1); // Skip Details, jump straight to Budget
        } catch (e) {
          console.error("Failed to parse prefill", e);
        }
      }
    }
  }, []);

  const progress = ((step + 1) / steps.length) * 100;
  const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

  const togglePriority = (id: string) => {
    setPriorities((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least 1
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  };

  const next = async () => {
    setDirection(1);
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    // ── Final step: submit ──────────────────────────────────────────
    if (!user) {
      toast.error("Please log in to generate a plan");
      navigate({ to: "/login" });
      return;
    }

    setGenerating(true);

    const budgetTier = budget < 500000 ? "budget" : budget < 1500000 ? "mid" : "premium";

    try {
      console.log("[Plan] Submitting quiz...", {
        budget,
        guests,
        religion,
        theme,
        state,
        priorities,
      });

      const religionKey = religion === "South Indian" ? "south_indian" : religion.toLowerCase();

      const aiPlanRes = await apiFetch("/generate-plan", {
        method: "POST",
        body: JSON.stringify({
          budget,
          guests,
          theme: theme.toLowerCase(),
          location: state,
          religion: religionKey,
          priorities, // Now an array
        }),
      });

      if (aiPlanRes.data) {
        sessionStorage.setItem("wedding_plan", JSON.stringify(aiPlanRes.data));
        console.log("[Plan] Unified plan stored ✅");
      } else {
        throw new Error("Invalid response from API");
      }

      // Store quiz answers for results page to use
      sessionStorage.setItem(
        "quiz_answers",
        JSON.stringify({
          coupleNames,
          loveStory,
          weddingDate,
          budget,
          guests,
          religion: religionKey,
          theme: theme.toLowerCase(),
          state,
          priorities,
          budgetTier,
        }),
      );

      navigate({ to: "/results" });
    } catch (err: any) {
      console.error("[Plan] Submit error:", err);
      toast.error("Something went wrong", { description: err.message });
      setGenerating(false);
    }
  };

  const back = () => {
    if (isPrefilled && step === 1) {
      // If they hit back on the first step of the prefilled journey, just take them back to explore
      navigate({ to: "/explore" });
      return;
    }
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (generating) {
    return (
      <Layout>
        <LoadingScreen />
      </Layout>
    );
  }

  const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-20 md:py-28 min-h-[100dvh] flex flex-col justify-center">
        <div className="text-center mb-12 drop-shadow-md">
          <p
            className="text-[0.65rem] uppercase tracking-[0.4em] font-black mb-4"
            style={{
              background: GOLD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ✦ Step {String(step + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")} ✦
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] drop-shadow-lg text-white">
            Let's design your{" "}
            <span
              className="italic"
              style={{
                background: GOLD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              wedding
            </span>
          </h1>
          <p className="text-white/40 text-sm mt-3 font-serif italic">
            A 60-second AI journey to your perfect day
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-14">
          <div className="relative h-px bg-border/70 mb-6">
            <div
              className="absolute top-0 left-0 h-px bg-gradient-gold transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between">
            {Array.isArray(steps) &&
              steps.map((s, i) => {
                const isDone = i < step;
                const isActive = i === step;
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => {
                      setDirection(i > step ? 1 : -1);
                      setStep(i);
                    }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <span
                      className={`h-10 w-10 rounded-full grid place-items-center border transition-all duration-500 ${
                        isActive
                          ? "bg-foreground text-background border-foreground shadow-glow scale-110"
                          : isDone
                            ? "bg-gradient-gold text-primary-foreground border-transparent"
                            : "bg-white/80 text-muted-foreground border-border group-hover:border-primary/40"
                      }`}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span
                      className={`hidden sm:block text-[0.6rem] uppercase tracking-[0.22em] transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Step card */}
        <div
          key={step}
          className="rounded-[2.5rem] shadow-luxury p-10 md:p-16 overflow-hidden"
          style={{
            background: "oklch(1 0 0 / 0.11)",
            border: "1px solid oklch(1 0 0 / 0.22)",
            backdropFilter: "blur(28px)",
            animation: `step-${direction === 1 ? "in-right" : "in-left"} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both`,
          }}
        >
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-primary mb-4">
            {steps[step].label}
          </p>

          {/* Step 0 — Details */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl md:text-5xl text-white">
                  Who is getting married?
                </h2>
                <p className="text-white/40 font-serif italic text-sm mt-2">
                  Start your love story with us.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[0.65rem] text-white/40 uppercase tracking-widest mb-2 block">
                    Couple's Names
                  </label>
                  <input
                    type="text"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    placeholder="e.g. Priyanjali & Rohan"
                    className="w-full bg-white/5 text-white border border-white/10 focus:border-amber-400/50 rounded-2xl px-5 py-4 text-2xl font-display outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] text-white/40 uppercase tracking-widest mb-2 block">
                    Proposed Wedding Date
                  </label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-white/5 text-white border border-white/10 focus:border-amber-400/50 rounded-2xl px-5 py-4 text-2xl font-display outline-none transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] text-white/40 uppercase tracking-widest mb-2 block">
                    Your Love Story (Optional)
                  </label>
                  <textarea
                    value={loveStory}
                    onChange={(e) => setLoveStory(e.target.value)}
                    placeholder="How did you meet? What makes your love story unique..."
                    rows={3}
                    className="w-full bg-white/5 text-white/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-5 py-4 text-sm font-serif italic outline-none transition-colors resize-none placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Steps 1 and 2 (State, Theme) were removed from UI to make this a flow engine. State and Theme are inferred from Explore prefill or defaults. */}

          {/* Step 1 — Budget */}
          {step === 1 && (
            <div className="space-y-12">
              <h2 className="font-display text-4xl md:text-5xl">What's your budget?</h2>
              <div>
                <p className="text-6xl md:text-7xl font-display italic text-gradient-gold mb-8 drop-shadow-md">
                  {inr(budget)}
                </p>
                <input
                  type="range"
                  min={150000}
                  max={10000000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground mt-4">
                  <span>₹1.5 Lakh</span>
                  <span>₹1 Crore</span>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { label: "Budget", value: 300000, hint: "Up to ₹3L" },
                    { label: "Mid", value: 800000, hint: "₹5L – ₹15L" },
                    { label: "Premium", value: 2500000, hint: "₹15L+" },
                  ].map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setBudget(t.value)}
                      className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
                        Math.abs(budget - t.value) < 100000
                          ? "border-primary bg-white shadow-glow text-black"
                          : "border-border bg-white/90 hover:border-primary/40 text-black shadow-md"
                      }`}
                    >
                      <p className="font-display text-lg">{t.label}</p>
                      <p className="text-xs text-black/60 mt-1">{t.hint}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Guests */}
          {step === 2 && (
            <div className="space-y-12">
              <h2 className="font-display text-4xl md:text-5xl drop-shadow-md text-white">
                How many guests?
              </h2>
              <div>
                <input
                  type="number"
                  value={guests}
                  min={10}
                  max={5000}
                  onChange={(e) => setGuests(+e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-border focus:border-primary px-1 py-5 text-5xl md:text-6xl font-display italic text-gradient-gold outline-none transition-colors"
                />
                <p className="mt-4 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Approximate count is fine
                </p>
                <div className="mt-8 flex gap-3 flex-wrap">
                  {Array.isArray([50, 150, 300, 500, 1000]) &&
                    [50, 150, 300, 500, 1000].map((n) => (
                      <button
                        key={n}
                        onClick={() => setGuests(n)}
                        className={`rounded-full border px-5 py-2 text-sm font-bold transition-all duration-300 ${
                          guests === n
                            ? "border-primary bg-white shadow-glow text-primary"
                            : "border-border bg-white/90 hover:border-primary/40 text-black shadow-md"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Religion */}
          {step === 3 && (
            <div className="space-y-10">
              <h2 className="font-display text-4xl md:text-5xl drop-shadow-md text-white">
                Your religion & traditions?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.isArray(RELIGIONS) &&
                  RELIGIONS.map((r) => {
                    const active = religion === r.name;
                    return (
                      <button
                        key={r.name}
                        onClick={() => setReligion(r.name)}
                        className={`relative w-full rounded-3xl overflow-hidden text-left transition-all duration-500 group border border-white/10 ${
                          active
                            ? "-translate-y-1 shadow-glow ring-2 ring-primary/80"
                            : "hover:-translate-y-0.5 hover:shadow-soft"
                        }`}
                        style={{ height: "190px" }}
                      >
                        {/* Background image */}
                        <div className="absolute inset-0 z-0">
                          <SmartImage
                            path={r.bg}
                            alt={r.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            fallbackType="default"
                          />
                        </div>
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-20 p-5 flex flex-col justify-between h-full w-full pointer-events-none">
                          {/* Top Row: Emoji & Selection State */}
                          <div className="flex justify-between items-start w-full">
                            <span className="text-base px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-medium">
                              {r.emoji}
                            </span>
                            {active && (
                              <span className="h-7 w-7 rounded-full bg-white grid place-items-center shadow-lg">
                                <Check className="h-4 w-4 text-primary" />
                              </span>
                            )}
                          </div>

                          {/* Bottom Row: Info */}
                          <div className="space-y-1.5 w-full text-left">
                            <h3
                              className="font-display italic text-3xl md:text-4xl text-white font-medium"
                              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                            >
                              {r.name}
                            </h3>
                            <p
                              className="text-white/80 text-xs md:text-sm line-clamp-1 max-w-[90%]"
                              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                            >
                              {r.desc}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {Array.isArray(r.events) &&
                                r.events.slice(0, 3).map((ev) => (
                                  <span
                                    key={ev}
                                    className="text-[0.65rem] font-medium px-2 py-0.5 rounded bg-black/50 text-white backdrop-blur-sm border border-white/10"
                                  >
                                    {ev}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Step 4 — Vibe & Location */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl md:text-5xl text-white">Location & vibe?</h2>
                <p className="text-white/40 font-serif italic text-sm mt-2">
                  Choose where you want to celebrate and the overall aesthetic.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[0.65rem] text-white/40 uppercase tracking-widest mb-3 block">
                    Wedding Destination
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "Rajasthan",
                      "Goa",
                      "Kerala",
                      "Delhi",
                      "Mumbai",
                      "Udaipur",
                      "Jaipur",
                      "Shimla",
                      "Other",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => setState(s === "Other" ? state : s)}
                        className={`rounded-2xl border py-4 px-4 text-center transition-all duration-300 ${
                          state === s
                            ? "border-primary bg-white shadow-glow text-black"
                            : "border-border bg-white/90 hover:border-primary/40 text-black shadow-md"
                        }`}
                      >
                        <p className="font-display text-lg">{s}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[0.65rem] text-white/40 uppercase tracking-widest mb-3 block">
                    Wedding Aesthetic
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        className={`rounded-2xl border py-4 px-4 text-center transition-all duration-300 ${
                          theme === t.name
                            ? "border-primary bg-white shadow-glow text-black"
                            : "border-border bg-white/90 hover:border-primary/40 text-black shadow-md"
                        }`}
                      >
                        <p className="font-display text-lg">{t.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Priority */}
          {step === 5 && (
            <div className="space-y-12">
              <h2 className="font-display text-4xl md:text-5xl">What matters most?</h2>
              <p className="text-muted-foreground">
                Select one or more priorities to personalise your AI plan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(PRIORITIES) &&
                  PRIORITIES.map((p) => {
                    const active = priorities.includes(p.id);
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePriority(p.id)}
                        className={`relative rounded-2xl border p-5 text-left transition-all duration-300 flex flex-col gap-3 ${
                          active
                            ? "border-primary bg-white shadow-glow -translate-y-1 text-black"
                            : "border-border bg-white/80 hover:border-primary/40 hover:-translate-y-0.5 text-foreground"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`p-2 rounded-full ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                          >
                            <Icon className="w-5 h-5" />
                          </span>
                          {active && (
                            <span className="h-5 w-5 rounded-full bg-gradient-gold grid place-items-center text-primary-foreground">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${active ? "text-black" : "text-muted-foreground"}`}
                          >
                            {p.label}
                          </p>
                          <p className="mt-1 text-[0.65rem] text-muted-foreground/80 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Summary preview */}
              <div
                className="rounded-2xl border p-6"
                style={{ background: "oklch(1 0 0 / 0.10)", borderColor: "oklch(1 0 0 / 0.22)" }}
              >
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary mb-4 flex items-center gap-2">
                  <Star className="h-3 w-3" /> Your wedding summary
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {[
                    ["Couple", coupleNames],
                    ["Date", weddingDate],
                    ["Budget", inr(budget)],
                    ["Guests", guests.toString()],
                    ["Religion", religion],
                    ["Theme", theme],
                    ["State", state],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                  <div className="col-span-2 md:col-span-3 pt-2">
                    <p className="text-xs text-muted-foreground mb-1.5">Priorities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(priorities) &&
                        priorities.map((pId) => {
                          const label = PRIORITIES.find((p) => p.id === pId)?.label;
                          return (
                            <span
                              key={pId}
                              className="inline-flex bg-primary/10 text-primary text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            >
                              {label}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-16 pt-10 border-t border-border/40 flex justify-between items-center">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] font-medium text-foreground/70 hover:text-primary disabled:opacity-30 disabled:hover:text-foreground/70 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              onClick={next}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-gold px-10 py-4 text-[0.75rem] uppercase tracking-[0.24em] font-black text-black shadow-luxury hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700" />
              <span className="relative">
                {step === steps.length - 1 ? "Generate My Plan ✨" : "Continue"}
              </span>
              <ArrowRight className="relative h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
