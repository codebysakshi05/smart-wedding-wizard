import React from "react";
import SmartImage from "./SmartImage";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  className?: string;
  aspectRatio?: string;
}

export function CategoryCard({
  title,
  description,
  image,
  link = "/plan",
  className,
  aspectRatio = "aspect-[3/4]",
}: CategoryCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card transition-all duration-700 hover:shadow-luxury hover:-translate-y-1",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", aspectRatio)}>
        <SmartImage
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          aspectRatio="aspect-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-primary font-bold mb-2 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Discovery
          </p>
          <h3 className="font-display text-3xl text-white mb-2 leading-tight">{title}</h3>
          <p className="text-white/70 text-sm leading-relaxed mb-6 max-h-0 overflow-hidden transition-all duration-700 group-hover:max-h-20">
            {description}
          </p>

          <div className="flex items-center gap-2 text-white text-[0.65rem] font-bold uppercase tracking-widest">
            <span>Explore Experience</span>
            <div className="w-8 h-px bg-primary/50 transition-all duration-500 group-hover:w-12" />
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
