import React from "react";
import { MapPin } from "lucide-react";

export default function VenueMap({ lat, lng, name, address }) {
  // Use OpenStreetMap for a simple, zero-config map embed that works well in iframes
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.05}%2C${lng + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="relative w-full h-full min-h-[250px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group">
      {/* Map iframe */}
      <iframe
        width="100%"
        height="100%"
        className="absolute inset-0 grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        title={`Map location of ${name}`}
      ></iframe>

      {/* Overlay gradient for cinematic look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Luxury Pin overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-start gap-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">{name}</p>
          <p className="text-[0.65rem] text-neutral-300 mt-0.5">{address}</p>
        </div>
      </div>
    </div>
  );
}
