import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { RefreshCw, Palette, Droplets, Sun, Wand2, Download } from "lucide-react";
import {
  getDecorImage,
  getVenueImage,
  getFallbackImage,
  handleImageFallback,
} from "@/utils/assets";

// ── Theme configurations (no hardcoded image paths!)
const THEMES = {
  Royal: {
    loader: () => getDecorImage("wedding", "premium"),
    description: "Traditional royal aesthetic",
  },
  Minimalist: {
    loader: () => getDecorImage("engagement", "premium"),
    description: "Clean and simple design",
  },
  Beach: {
    loader: () => getVenueImage("goa", ""),
    description: "Relaxed beach vibes",
  },
} as const;

type Theme = keyof typeof THEMES;

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Interactive Editor — Wedding Wizard" },
      {
        name: "description",
        content: "Customize your wedding theme, colors and lighting in real time.",
      },
      { property: "og:title", content: "Interactive Wedding Editor" },
      {
        property: "og:description",
        content: "Customize themes, colors and lighting with live preview.",
      },
    ],
  }),
  component: Editor,
});

const colorSwatches: Record<string, string> = {
  Gold: "linear-gradient(135deg, #e8c97a, #b88a2c)",
  Pastel: "linear-gradient(135deg, #f6d6d6, #c8d8e4)",
  Red: "linear-gradient(135deg, #d94a4a, #8a1f1f)",
};

function Editor() {
  const [theme, setTheme] = useState<Theme>("Royal");
  const [color, setColor] = useState("Gold");
  const [light, setLight] = useState("Warm");
  const [previewKey, setPreviewKey] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [themeImage, setThemeImage] = useState<string>(getFallbackImage());
  const [loadingImage, setLoadingImage] = useState(true);

  // Load theme image when theme changes
  useEffect(() => {
    (async () => {
      try {
        setLoadingImage(true);
        const image = await THEMES[theme].loader();
        setThemeImage(image);
      } catch (err) {
        console.error(`Failed to load ${theme} image:`, err);
        setThemeImage(getFallbackImage());
      } finally {
        setLoadingImage(false);
      }
    })();
  }, [theme]);

  const update = () => {
    setUpdating(true);
    setTimeout(() => {
      setPreviewKey((k) => k + 1);
      setUpdating(false);
    }, 600);
  };

  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] font-medium border transition-all duration-300 hover:-translate-y-0.5 ${
        active
          ? "border-primary bg-foreground text-background shadow-soft"
          : "border-border bg-white/60 text-foreground/70 hover:border-primary/50 hover:text-foreground hover:bg-white hover:shadow-soft"
      }`}
    >
      {children}
    </button>
  );

  const SectionHeader = ({
    icon: Icon,
    label,
    hint,
  }: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string;
    hint?: string;
  }) => (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cream to-secondary border border-border/60 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        </div>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-primary">{label}</p>
      </div>
      {hint && (
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32">
        <div className="text-center mb-16 animate-fade-up">
          <p className="divider-gold text-[0.7rem] uppercase tracking-[0.3em] text-primary mb-6">
            Live Editor
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">
            Design your <span className="italic text-gradient-gold">celebration</span>
          </h1>
          <p className="mt-6 text-foreground/60 max-w-lg mx-auto">
            Adjust the theme, palette and lighting — see your scene re-imagined instantly.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
          {/* Controls */}
          <aside
            className="glass rounded-[2rem] shadow-soft h-fit lg:sticky lg:top-28 overflow-hidden animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Theme group */}
            <div className="p-8 md:p-10">
              <SectionHeader icon={Wand2} label="Theme" hint={theme} />
              <div className="flex flex-wrap gap-2">
                {(Object.keys(THEMES) as Theme[]).map((t) => (
                  <Pill key={t} active={theme === t} onClick={() => setTheme(t)}>
                    {t}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Color group with swatches */}
            <div className="p-8 md:p-10">
              <SectionHeader icon={Palette} label="Color Palette" hint={color} />
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(colorSwatches).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`group relative rounded-2xl p-3 border transition-all duration-300 hover:-translate-y-0.5 ${
                      color === c
                        ? "border-primary bg-white shadow-soft"
                        : "border-border bg-white/40 hover:border-primary/50 hover:bg-white hover:shadow-soft"
                    }`}
                  >
                    <div
                      className="h-10 rounded-lg shadow-inner ring-1 ring-black/5"
                      style={{ background: colorSwatches[c] }}
                    />
                    <p
                      className={`mt-2 text-[0.65rem] uppercase tracking-[0.2em] ${
                        color === c ? "text-foreground font-medium" : "text-foreground/60"
                      }`}
                    >
                      {c}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Lighting group */}
            <div className="p-8 md:p-10">
              <SectionHeader icon={Sun} label="Lighting" hint={light} />
              <div className="flex flex-wrap gap-2">
                {["Warm", "Bright", "Soft"].map((l) => (
                  <Pill key={l} active={light === l} onClick={() => setLight(l)}>
                    {l}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Actions */}
            <div className="p-8 md:p-10 space-y-3">
              <button
                onClick={update}
                disabled={updating}
                className="group w-full inline-flex items-center justify-center gap-3 rounded-full bg-foreground text-background px-7 py-4 text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-primary hover:shadow-glow transition-all duration-300 disabled:opacity-70"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 transition-transform group-hover:rotate-180 ${updating ? "animate-spin" : ""}`}
                />
                {updating ? "Updating…" : "Update Preview"}
              </button>
              <button className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-white/60 border border-border px-7 py-4 text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-white hover:border-primary/40 hover:shadow-soft transition-all duration-300">
                <Download className="h-3.5 w-3.5" /> Export Image
              </button>
            </div>
          </aside>

          {/* Preview */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="rounded-[2rem] overflow-hidden shadow-luxury bg-card border border-border/60 ring-1 ring-white/60 min-h-[60vh] relative group">
              {/* Top bar like a design tool */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/30 to-transparent">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                </div>
                <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/80">
                  Preview · {theme}
                </span>
                <Droplets className="h-3.5 w-3.5 text-white/70" />
              </div>

              {updating && (
                <div className="absolute inset-0 z-10 grid place-items-center glass animate-fade-up">
                  <LoadingScreen
                    variant="card"
                    showSkeleton={false}
                    message="Re-imagining your scene…"
                    subtle="Applying your selections"
                  />
                </div>
              )}

              {loadingImage && (
                <div className="absolute inset-0 z-10 grid place-items-center glass animate-fade-up">
                  <LoadingScreen
                    variant="card"
                    showSkeleton={true}
                    message="Loading theme image…"
                    subtle="Finding the perfect preview"
                  />
                </div>
              )}

              <img
                key={previewKey + theme}
                src={themeImage}
                alt={`${theme} wedding preview`}
                className={`w-full h-full object-cover animate-fade-up transition-transform duration-700 group-hover:scale-[1.02] ${
                  loadingImage ? "opacity-0" : "opacity-100"
                }`}
                loading="lazy"
                onError={handleImageFallback}
                width={1280}
                height={896}
              />

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                <span className="glass rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em]">
                  <span className="text-muted-foreground">Theme</span> ·{" "}
                  <span className="font-medium">{theme}</span>
                </span>
                <span className="glass rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em]">
                  <span className="text-muted-foreground">Color</span> ·{" "}
                  <span className="font-medium">{color}</span>
                </span>
                <span className="glass rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em]">
                  <span className="text-muted-foreground">Light</span> ·{" "}
                  <span className="font-medium">{light}</span>
                </span>
              </div>
            </div>

            {/* Caption row */}
            <div className="flex items-center justify-between px-2 text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
              <span>Auto-saved</span>
              <span>1280 × 896</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
