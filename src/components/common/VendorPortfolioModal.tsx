import React from "react";
import { X, MapPin, Star, Sparkles, Mail, Phone, CalendarCheck } from "lucide-react";
import SmartImage from "../ui/SmartImage";

export default function VendorPortfolioModal({ vendor, isOpen, onClose }) {
  if (!isOpen || !vendor) return null;

  // Mock portfolio images based on category
  const portfolioImages = [
    vendor.image,
    "/assets/photography/candid/cover.webp",
    "/assets/photography/traditional/cover.avif",
    "/assets/photography/couple/cover.webp",
    "/assets/decor/haldi/premium/cover.webp",
    "/assets/decor/reception/premium/cover.webp",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-luxury flex flex-col md:flex-row overflow-hidden z-10 animate-in zoom-in-95 duration-500">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/50 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Profile & Details */}
        <div className="w-full md:w-2/5 bg-black/40 border-r border-white/5 p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-800">
                <SmartImage
                  path={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[0.6rem] uppercase tracking-widest font-bold rounded-full">
                  {vendor.category}
                </span>
                <span className="flex items-center gap-1 text-[0.7rem] text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400" /> {vendor.rating}
                </span>
              </div>
              <h2 className="font-display text-4xl text-white leading-none">{vendor.name}</h2>
              <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  {vendor.city || "Mumbai"}, {vendor.state || "Maharashtra"}
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 font-serif italic leading-relaxed">
              {vendor.description ||
                "A master in delivering bespoke, premium experiences for luxury Indian weddings. Creating timeless memories with unparalleled attention to detail."}
            </p>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/10">
              <div>
                <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mb-1">
                  Pricing Starts
                </p>
                <p className="text-lg font-bold text-white tracking-tight">
                  {vendor.priceRange || "₹1,50,000"}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mb-1">
                  Service Tier
                </p>
                <p className="text-lg font-bold text-primary tracking-tight capitalize">
                  {vendor.budget || "Premium"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-bold">
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {(vendor.tags || ["Luxury", "Royal", "Cinematic"]).map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300 capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <button className="w-full py-4 bg-primary text-neutral-900 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:shadow-glow transition-all flex items-center justify-center gap-2">
              <CalendarCheck className="w-4 h-4" /> Check Availability
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[0.65rem] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
              <button className="py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[0.65rem] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Message
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Portfolio Gallery */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto bg-black/20">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-display text-2xl text-white">Featured Portfolio</h3>
          </div>

          <div className="columns-2 gap-4 space-y-4">
            {portfolioImages.map((src, idx) => (
              <div
                key={idx}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
              >
                <SmartImage
                  path={src}
                  alt={`Portfolio ${idx}`}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  fallbackType="default"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
