import React from "react";
import SmartImage from "./SmartImage";
import { Heart, Maximize2, Sparkles, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InspirationCardProps {
  src: string;
  alt?: string;
  category?: string;
  religion?: string;
  event?: string;
  title?: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onView?: () => void;
  onShowSimilar?: () => void;
  aspectRatio?: "aspect-square" | "aspect-video" | "aspect-[4/5]" | "aspect-[3/4]" | "aspect-auto";
  className?: string;
}

export function InspirationCard({
  src,
  alt = "Inspiration",
  category,
  religion,
  event,
  title,
  isSaved,
  onToggleSave,
  onView,
  onShowSimilar,
  aspectRatio = "aspect-auto",
  className,
}: InspirationCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-border/50 bg-muted/30 transition-all duration-500 hover:shadow-glow cursor-zoom-in break-inside-avoid mb-6",
        className,
      )}
      onClick={onView}
    >
      {/* Image with Hover Zoom */}
      <SmartImage
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        className="transition-transform duration-[3000ms] cubic-bezier(0.1, 0, 0, 1) group-hover:scale-110"
      />

      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 p-8 flex flex-col justify-end">
        {/* Top Actions: Pinterest Style Save */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start transform -translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex flex-col gap-2">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[0.55rem] text-white font-bold uppercase tracking-widest w-fit">
              {category || "Discovery"}
            </div>
            {religion && religion !== "all" && (
              <div className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 text-[0.5rem] text-primary-foreground font-black uppercase tracking-[0.2em] w-fit">
                {religion}
              </div>
            )}
            {event && event !== "all" && (
              <div className="px-3 py-1 bg-gold/20 backdrop-blur-md rounded-full border border-gold/30 text-[0.5rem] text-gold font-black uppercase tracking-[0.2em] w-fit">
                {event}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.();
            }}
            className={cn(
              "px-5 py-2.5 rounded-full font-black text-[0.65rem] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-glow",
              isSaved
                ? "bg-primary text-primary-foreground"
                : "bg-[#e60023] text-white hover:bg-[#ad001d]", // Pinterest Red
            )}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {/* Content */}
        <div className="transform translate-y-6 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
          <h4 className="text-white font-display text-2xl leading-tight mb-4">
            {title || "Cinematic Vision"}
          </h4>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.();
                }}
                className="flex items-center gap-3 text-white/70 text-[0.6rem] font-black tracking-[0.2em] uppercase hover:text-white transition-all group/btn"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                Expand
              </button>
              <a
                href={`/plan?religion=${encodeURIComponent(religion || "")}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-full text-[0.6rem] font-black tracking-[0.2em] uppercase transition-all shadow-glow hover:scale-105"
              >
                <Sparkles className="w-3 h-3" /> Plan This
              </a>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowSimilar?.();
                }}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all"
                title="Visual Match"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Indicator (Visible always if saved) */}
      {isSaved && (
        <div className="absolute top-4 left-4 p-2 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-lg">
          <Heart className="w-3 h-3 fill-current" />
        </div>
      )}
    </div>
  );
}
