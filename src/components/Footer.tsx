import { motion } from "motion/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

const FOOTER_SECTIONS = [
  {
    heading: "Plan Your Wedding",
    links: [
      { label: "AI Wedding Planner", href: "/plan" },
      { label: "Explore Venues", href: "/explore" },
      { label: "Decor Inspirations", href: "/explore" },
      { label: "Outfit Stylizer", href: "/explore" },
      { label: "Budget Calculator", href: "/plan" },
    ],
  },
  {
    heading: "Ceremonies",
    links: [
      { label: "Hindu Weddings", href: "/plan" },
      { label: "Muslim Weddings", href: "/plan" },
      { label: "Christian Weddings", href: "/plan" },
      { label: "Sikh Weddings", href: "/plan" },
      { label: "South Indian Weddings", href: "/plan" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Featured Venues", href: "/explore" },
      { label: "Premium Services", href: "/explore" },
      { label: "Real Weddings", href: "/explore" },
      { label: "My Dashboard", href: "/dashboard" },
      { label: "Help & Support", href: "#" },
    ],
  },
];

export function Footer() {
  const location = useLocation();
  const isPlanRoute = location.pathname === "/plan";

  return (
    <footer className="relative mt-32 border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none blur-3xl"
        style={{ background: GOLD }}
      />

      <div className="relative" style={{ background: "rgba(4,3,1,0.96)" }}>
        {/* ── TOP CTA BAND ── */}
        {!isPlanRoute && (
          <div
            className="border-b border-white/5 py-12 px-6"
            style={{ background: "rgba(201,153,74,0.04)" }}
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] font-black mb-2 text-amber-400">
                  Start Today — It's Free
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-white">
                  Your Dream Wedding Awaits.
                </h3>
              </div>
              <Link
                to="/plan"
                className="group relative inline-flex items-center gap-3 rounded-full px-10 py-4 text-xs uppercase tracking-[0.3em] font-black text-black transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(201,153,74,0.4)] shrink-0"
                style={{ background: GOLD }}
              >
                <span className="absolute inset-0 rounded-full -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 overflow-hidden pointer-events-none" />
                <Sparkles className="w-4 h-4 relative" />
                <span className="relative">Begin My Journey</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── MAIN FOOTER CONTENT ── */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14">
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group w-fit">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-amber-400/20"
                  style={{ background: "rgba(201,153,74,0.1)" }}
                >
                  <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <span
                  className="text-lg text-white/90 group-hover:text-white transition-colors"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Smart Wedding Wizard
                </span>
              </Link>

              <p className="text-sm text-white/50 leading-relaxed font-serif italic max-w-sm">
                India's most cinematic AI wedding planning platform — weaving your love story into a
                timeless experience across every ceremony and tradition.
              </p>

              {/* Contact info */}
              <div className="space-y-3 pt-2">
                <a
                  href="mailto:hello@dreamweaver.ai"
                  className="flex items-center gap-3 text-xs text-white/40 hover:text-amber-400 transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 group-hover:text-amber-400" />
                  hello@dreamweaver.ai
                </a>
                <a
                  href="tel:+919999999999"
                  className="flex items-center gap-3 text-xs text-white/40 hover:text-amber-400 transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 group-hover:text-amber-400" />
                  +91 99999 99999
                </a>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <MapPin className="w-3.5 h-3.5 text-amber-400/60" />
                  Mumbai · Delhi · Jaipur · Goa
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                {[
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: Youtube, href: "#", label: "YouTube" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/10 hover:border-amber-400/40 flex items-center justify-center text-white/40 hover:text-amber-400 transition-all duration-300 hover:bg-amber-400/5"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
              {FOOTER_SECTIONS.map((section) => (
                <div key={section.heading}>
                  <h4
                    className="text-[0.6rem] uppercase tracking-[0.35em] font-black mb-6"
                    style={{
                      background: GOLD,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {section.heading}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href as any}
                          className="group flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors duration-200"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="border-t border-white/5 px-6 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[0.6rem] text-white/25 uppercase tracking-widest">
            <p>© 2026 Smart Wedding Wizard. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white/60 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white/60 transition-colors">
                Cookie Settings
              </a>
            </div>
            <p className="flex items-center gap-1.5"></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
