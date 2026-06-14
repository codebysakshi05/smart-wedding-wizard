import { Sparkles } from "lucide-react";

type Props = {
  message?: string;
  subtle?: string;
  variant?: "full" | "card";
  showSkeleton?: boolean;
};

export function LoadingScreen({
  message = "Designing your dream wedding…",
  subtle = "Our AI is curating every exquisite detail",
  variant = "full",
  showSkeleton = true,
}: Props) {
  const wrapper =
    variant === "full"
      ? "mx-auto max-w-5xl px-6 lg:px-10 py-32 text-center animate-fade-up"
      : "w-full py-20 text-center animate-fade-up";

  return (
    <div className={wrapper}>
      <div className="inline-flex flex-col items-center gap-5">
        {/* Animated emblem */}
        <div className="relative h-20 w-20">
          <span className="absolute inset-0 rounded-full bg-gradient-gold opacity-20 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-gradient-gold opacity-30 blur-md" />
          <span className="absolute inset-0 rounded-full bg-gradient-gold grid place-items-center shadow-glow">
            <Sparkles className="h-7 w-7 text-white animate-float" strokeWidth={1.5} />
          </span>
        </div>

        <p className="font-display italic text-3xl md:text-4xl text-foreground mt-2">{message}</p>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-primary">{subtle}</p>

        {/* Progress shimmer line */}
        <div className="mt-2 h-px w-56 overflow-hidden bg-border rounded-full">
          <div className="h-full w-1/3 bg-gradient-gold animate-loading-bar" />
        </div>
      </div>

      {showSkeleton && (
        <div className="mt-16 grid gap-8 md:grid-cols-2 text-left">
          <div className="h-96 rounded-[2rem] skeleton-shimmer" />
          <div className="space-y-4">
            <div className="h-6 w-3/4 rounded-full skeleton-shimmer" />
            <div className="h-6 w-full rounded-full skeleton-shimmer" />
            <div className="h-6 w-5/6 rounded-full skeleton-shimmer" />
            <div className="h-40 rounded-2xl skeleton-shimmer" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 rounded-2xl skeleton-shimmer" />
              <div className="h-20 rounded-2xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
