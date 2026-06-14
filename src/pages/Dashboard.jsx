import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Calendar,
  Users,
  Wallet,
  Heart,
  MapPin,
  Trash2,
  LogOut,
  CheckSquare,
  Square,
  Clock,
  Utensils,
  Camera,
  Award,
  User,
  ChevronRight,
  Phone,
  Info,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_VENUES, MOCK_SERVICES } from "../data/mockData";
import SmartImage from "../components/ui/SmartImage";
import BudgetManager from "../components/ui/BudgetManager";
import { getWeddingPlans, deleteWeddingPlan } from "../utils/storage";
import { getFallbackImage } from "@/utils/imageResolver";

export default function Dashboard({ user, logout }) {
  const navigate = useNavigate();

  // Lists
  const [plans, setPlans] = useState([]);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [savedImages, setSavedImages] = useState([]);
  const [savedVendors, setSavedVendors] = useState([]);
  const [savedVenues, setSavedVenues] = useState([]);

  // Interactive Checklist
  const defaultChecklist = [
    { id: "chk_venue", text: "Book matched palace or beach resort venue", completed: false },
    { id: "chk_makeup", text: "Reserve luxury bridal makeup slot", completed: false },
    { id: "chk_decor", text: "Finalize floral and light setups with decorator", completed: false },
    { id: "chk_cater", text: "Arrange tasting and plate pricing with caterers", completed: false },
    { id: "chk_invite", text: "Send royal theme digital invitations", completed: false },
    { id: "chk_outfit", text: "Schedule couture fittings for bride & groom", completed: false },
  ];
  const [checklist, setChecklist] = useState(defaultChecklist);

  // Wedding Date & Countdown (defaults to 180 days out, editable)
  const [weddingDate, setWeddingDate] = useState(() => {
    const stored = localStorage.getItem("dw_wedding_date");
    if (stored) return stored;
    const future = new Date();
    future.setDate(future.getDate() + 180);
    return future.toISOString().split("T")[0];
  });

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });

  // 1. Load Data
  useEffect(() => {
    // Stored plans via storage manager
    const localPlans = getWeddingPlans();
    setPlans(localPlans);

    // Stored checklist
    const storedCheck = localStorage.getItem("dream_weaver_checklist_state");
    if (storedCheck) {
      try {
        setChecklist(JSON.parse(storedCheck));
      } catch (e) {}
    }

    // Stored moodboard images
    const saved = localStorage.getItem("dream_weaver_saved");
    if (saved) {
      try {
        setSavedImages(JSON.parse(saved));
      } catch (e) {}
    }

    // Shortlisted venues/vendors details
    const savedIdsStr = localStorage.getItem("saved_vendors");
    if (savedIdsStr) {
      try {
        const savedIds = JSON.parse(savedIdsStr);
        if (Array.isArray(savedIds) && savedIds.length > 0) {
          Promise.resolve([MOCK_SERVICES, MOCK_VENUES])
            .then(([servicesData, venuesData]) => {
              if (Array.isArray(servicesData)) {
                setSavedVendors(servicesData.filter((s) => savedIds.includes(s.id)));
              }
              if (Array.isArray(venuesData)) {
                setSavedVenues(venuesData.filter((v) => savedIds.includes(v.id || v.name)));
              }
            })
            .catch((err) => console.error("Error fetching detail records:", err));
        }
      } catch (e) {}
    }
  }, []);

  // 2. Countdown Timer Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(`${weddingDate}T00:00:00`);
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        setCountdown({ days, hours, mins });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // Persist Date
  const handleDateChange = (val) => {
    setWeddingDate(val);
    localStorage.setItem("dw_wedding_date", val);
    toast.success("Wedding countdown date updated!");
  };

  // Toggle checklist status
  const toggleChecklist = (id) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    setChecklist(updated);
    localStorage.setItem("dream_weaver_checklist_state", JSON.stringify(updated));
    toast.success("Checklist progress updated!");
  };

  // Delete plan
  const handleDeletePlan = (id) => {
    if (!confirm("Are you sure you want to delete this wedding plan?")) return;
    const success = deleteWeddingPlan(id);
    if (success) {
      const updated = plans.filter((p) => p._id !== id);
      setPlans(updated);
      if (activePlanIndex >= updated.length) {
        setActivePlanIndex(Math.max(0, updated.length - 1));
      }
      toast.success("Wedding itinerary deleted.");
    } else {
      toast.error("Failed to delete wedding plan.");
    }
  };

  // Load plan to active session and redirect
  const handleLoadPlan = (selected) => {
    try {
      sessionStorage.setItem("wedding_plan", JSON.stringify(selected.plan));

      const budgetTier =
        selected.budget < 500000 ? "budget" : selected.budget < 1500000 ? "mid" : "premium";

      sessionStorage.setItem(
        "quiz_answers",
        JSON.stringify({
          budget: selected.budget,
          guests: selected.guests,
          religion: selected.plan?.summary?.religion || "hindu",
          theme: selected.theme.toLowerCase(),
          state: selected.plan?.summary?.location || "Rajasthan",
          priorities: selected.plan?.priorities || ["luxury_decor"],
          budgetTier,
        }),
      );

      toast.success(`Loaded "${selected.theme}" plan blueprint!`);
      navigate({ to: "/results" });
    } catch (err) {
      toast.error("Failed to load plan parameters");
    }
  };

  const inr = (n) => "â‚¹" + (n || 0).toLocaleString("en-IN");

  const currentPlan = plans[activePlanIndex];
  const userReligion = currentPlan?.plan?.summary?.religion || "Hindu";
  const userState = currentPlan?.plan?.summary?.location || "Rajasthan";
  const userTheme = currentPlan?.theme || "Royal Traditional";
  const userBudget = currentPlan?.budget || 1500000;
  const userGuests = currentPlan?.guests || 150;

  // Custom theme accents
  const getThemeAccents = (rel) => {
    const k = (rel || "").toLowerCase();
    if (k.includes("hindu"))
      return {
        accentText: "text-amber-500",
        border: "hover:border-amber-500/40",
        textG: "from-amber-400 to-red-500",
      };
    if (k.includes("muslim"))
      return {
        accentText: "text-emerald-500",
        border: "hover:border-emerald-500/40",
        textG: "from-emerald-400 to-teal-500",
      };
    if (k.includes("christian"))
      return {
        accentText: "text-sky-400",
        border: "hover:border-sky-400/40",
        textG: "from-sky-300 to-indigo-400",
      };
    if (k.includes("sikh"))
      return {
        accentText: "text-rose-400",
        border: "hover:border-rose-400/40",
        textG: "from-rose-300 to-orange-400",
      };
    if (k.includes("south"))
      return {
        accentText: "text-yellow-500",
        border: "hover:border-yellow-500/40",
        textG: "from-yellow-400 to-amber-600",
      };
    return {
      accentText: "text-amber-500",
      border: "hover:border-amber-500/40",
      textG: "from-amber-400 to-red-500",
    };
  };

  const accents = getThemeAccents(userReligion);

  return (
    <div
      className="pt-24 pb-20 min-h-screen selection:bg-primary selection:text-neutral-900"
      style={{ background: "oklch(0.17 0.018 60)", color: "oklch(0.97 0.010 80)" }}
    >
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* â”€â”€â”€ 1. WELCOME HERO & COUNTDOWN â”€â”€â”€ */}
        <div
          className="glass rounded-[3rem] p-8 md:p-12 border border-white/18 flex flex-col lg:flex-row justify-between items-stretch gap-10 relative overflow-hidden shadow-luxury"
          style={{ background: "oklch(1 0 0 / 0.09)" }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[130px] -mr-32 -mt-32 pointer-events-none" />

          <div className="relative z-10 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[0.65rem] uppercase tracking-[0.4em] text-primary font-black block">
                Wedding Management Suite
              </span>
              <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-none">
                Bespoke Odyssey of <br />
                <span
                  className={`italic bg-gradient-to-r ${accents.textG} bg-clip-text text-transparent`}
                >
                  {user?.name || "Beloved Couple"}
                </span>
              </h1>
              <p className="text-white/75 text-sm max-w-lg font-serif italic">
                Manage your saved layouts, shortlisted palaces, premium services, and task
                checksheets in a unified workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-white/85">
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 border border-white/5 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>
                  Theme: <strong>{userTheme}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 border border-white/5 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>
                  Region: <strong>{userState}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 border border-white/5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>
                  Culture: <strong>{userReligion}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Countdown timer widget */}
          <div
            className="relative z-10 lg:w-96 rounded-3xl p-6 border border-white/18 flex flex-col justify-between gap-6"
            style={{ background: "oklch(1 0 0 / 0.09)" }}
          >
            <div className="space-y-1">
              <p className="text-[0.6rem] uppercase tracking-widest text-white/65 font-bold">
                Countdown Clock
              </p>
              <div className="flex justify-between text-center pt-2">
                <div>
                  <p className="text-4xl font-black text-white tracking-tight">{countdown.days}</p>
                  <p className="text-[0.55rem] uppercase text-white/65 font-bold tracking-widest">
                    Days
                  </p>
                </div>
                <div className="text-2xl text-neutral-600 self-center">:</div>
                <div>
                  <p className="text-4xl font-black text-white tracking-tight">{countdown.hours}</p>
                  <p className="text-[0.55rem] uppercase text-white/65 font-bold tracking-widest">
                    Hours
                  </p>
                </div>
                <div className="text-2xl text-neutral-600 self-center">:</div>
                <div>
                  <p className="text-4xl font-black text-white tracking-tight">{countdown.mins}</p>
                  <p className="text-[0.55rem] uppercase text-white/65 font-bold tracking-widest">
                    Minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="block text-[0.55rem] uppercase tracking-widest text-muted-foreground font-bold">
                Modify Wedding Date
              </label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                style={{
                  background: "oklch(0.24 0.02 65)",
                  border: "1px solid oklch(0.38 0.025 70)",
                }}
              />
            </div>
          </div>
        </div>

        {/* â”€â”€â”€ 2. SAVED WEDDING PLANS BLUEPRINT â”€â”€â”€ */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-white/10 pb-4">
            <div>
              <span className="text-[0.55rem] uppercase tracking-widest text-primary font-bold">
                Itineraries Directory
              </span>
              <h2 className="font-display text-3xl">Saved Wedding Plans</h2>
            </div>
            <Link
              to="/plan"
              className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
            >
              Generate Another Plan <PlusCircle className="w-4 h-4" />
            </Link>
          </div>

          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((p, idx) => {
                const isSelected = idx === activePlanIndex;
                return (
                  <div
                    key={p._id}
                    onClick={() => setActivePlanIndex(idx)}
                    className={`group glass rounded-[2.5rem] overflow-hidden border transition-all duration-500 cursor-pointer flex flex-col justify-between h-full relative ${
                      isSelected
                        ? "border-primary/50 bg-black/60 shadow-glow"
                        : "border-white/10 bg-black/30 hover:border-white/20"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                      <SmartImage
                        path={p.images?.[0]}
                        alt={p.theme}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        fallbackType="venue"
                      />
                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlan(p._id);
                          }}
                          className="p-2 bg-black/80 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-red-400 rounded-xl transition-all"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-[0.55rem] uppercase tracking-widest text-primary font-bold mb-1">
                          {p.plan?.summary?.religion || "Custom"} Itinerary
                        </span>
                        <h3 className="font-display text-2xl text-white group-hover:text-primary transition-colors truncate">
                          {p.theme}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 text-xs">
                        <div>
                          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest">
                            Planned Cap
                          </p>
                          <p className="font-bold text-white mt-0.5">{inr(p.budget)}</p>
                        </div>
                        <div>
                          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest">
                            Destination
                          </p>
                          <p className="font-bold text-white mt-0.5 truncate">
                            {p.plan?.summary?.location || "Rajasthan"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest">
                            Guests
                          </p>
                          <p className="font-bold text-white mt-0.5">{p.guests} pax</p>
                        </div>
                        <div>
                          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest">
                            Ceremonies
                          </p>
                          <p className="font-bold text-white mt-0.5">
                            {p.plan?.events?.length || 4} Days
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadPlan(p);
                          }}
                          className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-[0.65rem] font-bold uppercase tracking-widest text-white hover:bg-primary hover:text-neutral-900 hover:border-primary transition-all flex items-center justify-center gap-1"
                        >
                          Launch Blueprint <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        {isSelected && (
                          <div className="px-3.5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-[0.65rem] font-bold text-primary flex items-center justify-center">
                            Active
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass rounded-[2.5rem] p-10 md:p-16 border-dashed border-white/15 flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900 shadow-luxury">
                <SmartImage
                  path={getFallbackImage("default")}
                  alt="Luxury empty state"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <Calendar className="w-8 h-8 text-primary/50 animate-pulse mx-auto md:mx-0" />
                <div className="space-y-2">
                  <p className="text-2xl font-display text-white">Your Canvas is Empty</p>
                  <p className="text-muted-foreground text-sm font-serif italic max-w-sm mx-auto md:mx-0">
                    No curated itineraries found. Embark on the AI wedding journey to paint your
                    bespoke luxury celebration.
                  </p>
                </div>
                <Link
                  to="/plan"
                  className="inline-block px-6 py-3 bg-primary text-neutral-900 font-bold uppercase tracking-widest text-[0.65rem] rounded-xl hover:bg-white hover:shadow-glow transition-all"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ─── 3 & 4. CHECKLIST, TIMELINE & BUDGET COHORT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Notion Checklist */}
          <div className="glass rounded-[2.5rem] p-8 border border-white/10 bg-black/40 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <CheckSquare className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-display text-2xl">Wedding Checklist</h3>
                  <p className="text-xs text-muted-foreground">
                    Persisted workspace milestones to manage vendor actions.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-primary fill-primary/10 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-neutral-500 shrink-0" />
                    )}
                    <span
                      className={`text-sm font-semibold leading-snug ${item.completed ? "text-white/40 line-through" : "text-white/90"}`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-6 border-t border-white/5 text-[0.65rem] text-neutral-400 font-serif italic">
              Completed {checklist.filter((c) => c.completed).length} of {checklist.length} core
              tasks
            </div>
          </div>

          {/* Visual Event Timeline */}
          <div className="glass rounded-[2.5rem] p-8 border border-white/10 bg-black/40 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-display text-2xl">Itinerary Timeline</h3>
                <p className="text-xs text-muted-foreground">
                  Selected itinerary ceremonies & flow outline.
                </p>
              </div>
            </div>

            {currentPlan?.plan?.events ? (
              <div className="space-y-6 relative before:absolute before:left-[1.125rem] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                {currentPlan.plan.events.map((evt, idx) => (
                  <div key={idx} className="flex gap-6 relative">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center shrink-0 z-10 text-xs font-black text-primary">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                        {evt.time || evt.timing || "Event Moment"}
                      </p>
                      <h4 className="font-display text-lg text-white leading-tight">{evt.name}</h4>
                      <p className="text-neutral-400 text-xs font-serif italic line-clamp-2">
                        {evt.description || evt.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-400 italic">
                No active blueprint selected to render the timeline flow. Select a plan card above.
              </div>
            )}
          </div>

          {/* Budget Manager */}
          <BudgetManager totalBudget={userBudget} themeAccents={accents} />
        </div>

        {/* â”€â”€â”€ 5. SAVED PALACES & VENUES â”€â”€â”€ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-display text-3xl flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" /> Shortlisted Venues ({savedVenues.length})
            </h3>
          </div>

          {savedVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {savedVenues.map((v, i) => {
                const imgPath = v.image || v.localImagePath;
                return (
                  <div
                    key={i}
                    className="group glass rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 hover:border-primary/45 transition-all duration-500 flex flex-col justify-between h-full"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden bg-neutral-900 shrink-0">
                      <SmartImage
                        path={imgPath}
                        alt={v.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        fallbackType="venue"
                      />
                      <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[0.65rem] font-bold text-white flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span>{v.rating || 4.8}</span>
                      </div>
                    </div>

                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-display text-2xl text-white group-hover:text-primary transition-colors">
                          {v.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>
                            {v.city}, {v.state}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div>
                          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest mb-0.5">
                            Capacity
                          </p>
                          <p className="font-bold text-white text-xs">{v.capacity || 500} guests</p>
                        </div>
                        <div>
                          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest mb-0.5">
                            Price Level
                          </p>
                          <p className="font-bold text-primary uppercase text-xs tracking-wider">
                            {v.budget || "Premium"}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/919999999999?text=Hi,%20inquiring%20about%20booking%20${v.name}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4.5 rounded-2xl border text-center border-white/10 hover:border-primary text-white bg-transparent hover:bg-primary hover:text-neutral-900 text-[0.65rem] font-black uppercase tracking-widest transition-all duration-300 block"
                      >
                        Inquire Palace
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400 italic">
              No palaces or luxury beach settings shortlisted yet. Shortlist venues on the results
              page to display them here.
            </div>
          )}
        </section>

        {/* â”€â”€â”€ 6. SAVED LUXURY SERVICES â”€â”€â”€ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-display text-3xl flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" /> Shortlisted Service Collaborators (
              {savedVendors.length})
            </h3>
          </div>

          {savedVendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {savedVendors.map((vendor, i) => {
                const iconMap = {
                  photographer: Camera,
                  decorator: Award,
                  makeup: User,
                  caterer: Utensils,
                };
                const IconComp = iconMap[vendor.category] || Sparkles;
                return (
                  <div
                    key={i}
                    className="group glass rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 hover:border-primary/45 transition-all duration-500 flex flex-col justify-between h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 shrink-0">
                      <SmartImage
                        path={vendor.image || vendor.coverImage}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        fallbackType="default"
                      />
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[0.55rem] font-bold text-white flex items-center gap-1">
                        <IconComp className="w-3 h-3 text-primary" />
                        <span className="capitalize">{vendor.category}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-display text-xl text-white truncate">{vendor.name}</h4>
                        <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">
                          {vendor.city}, {vendor.state}
                        </p>
                      </div>

                      <p className="text-[0.65rem] text-neutral-400 font-serif italic line-clamp-2 leading-relaxed">
                        {vendor.description}
                      </p>

                      <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                        <span className="text-[0.65rem] font-bold text-neutral-300">
                          {vendor.priceRange}
                        </span>
                        <a
                          href={vendor.instagram || vendor.website || "https://instagram.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.65rem] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400 italic">
              No service vendors shortlisted yet. Shortlist photographers, decorators, and makeup
              experts on the results page to show them here.
            </div>
          )}
        </section>

        {/* ─── 7. INSPIRATION MOODBOARD ─── */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-display text-3xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" /> Inspiration Moodboard
            </h3>
            <p className="text-xs text-muted-foreground mt-2">Saved imagery and aesthetics for your luxury wedding.</p>
          </div>

          {savedImages && savedImages.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {savedImages.map((img, i) => (
                <div key={i} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900">
                  <SmartImage
                    path={img}
                    alt={`Inspiration ${i}`}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    fallbackType="default"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary fill-primary drop-shadow-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-[2.5rem] p-10 border-dashed border-white/15 text-center space-y-4">
              <Camera className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-neutral-400 text-sm font-serif italic max-w-sm mx-auto">
                Your moodboard is currently empty. Explore the AI Planner results and save the looks that resonate with your vision.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
