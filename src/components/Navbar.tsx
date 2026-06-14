import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

const GOLD = "linear-gradient(135deg,#f5d98a 0%,#c9994a 55%,#a0722a 100%)";

function LogoMark() {
  return (
    <svg
      width="36"
      height="22"
      viewBox="0 0 44 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="0" y="3" width="14" height="20" rx="3" fill="white" />
      <rect x="16" y="0" width="12" height="26" rx="3" fill="white" opacity="0.85" />
      <rect x="30" y="5" width="14" height="16" rx="3" fill="white" opacity="0.60" />
    </svg>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { label: "Home", to: "/" as const },
    { label: "Explore", to: "/explore" as const },
    { label: "AI Planner", to: "/plan" as const },
    { label: "Venues", to: "/explore" as const },
    ...(user ? [{ label: "Dashboard", to: "/dashboard" as const }] : []),
  ];

  const isActive = (to: string) => currentPath === to;

  return (
    <>
      {/* ── FLOATING PILL NAVBAR ── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-4">
        <div
          className="flex items-center justify-between rounded-full px-4 py-2.5 border border-white/12"
          style={{
            background: "rgba(6,4,1,0.62)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "0 4px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(201,153,74,0.08)",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <LogoMark />
            <span
              className="hidden sm:block text-[0.82rem] tracking-wide text-white/90 group-hover:text-white transition-colors"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Smart Wedding Wizard
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label + l.to}
                to={l.to}
                className={`
                  relative px-3.5 py-1.5 rounded-full text-[0.66rem] uppercase tracking-[0.22em] font-semibold
                  transition-all duration-300
                  ${isActive(l.to) ? "text-white" : "text-white/48 hover:text-white/85"}
                `}
              >
                {isActive(l.to) && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(201,153,74,0.14)",
                      border: "1px solid rgba(201,153,74,0.25)",
                    }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <button
                onClick={logout}
                className="hidden sm:block text-[0.66rem] uppercase tracking-[0.2em] font-semibold text-white/48 hover:text-white/80 transition-colors px-3 py-1.5"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block text-[0.66rem] uppercase tracking-[0.2em] font-semibold text-white/48 hover:text-white/80 transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/plan"
              className="relative overflow-hidden flex items-center rounded-full px-5 py-2 text-[0.66rem] uppercase tracking-[0.22em] font-bold text-black transition-all duration-300 hover:scale-105 active:scale-95 group"
              style={{
                background: GOLD,
                boxShadow: "0 0 18px rgba(201,153,74,0.38)",
              }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 pointer-events-none" />
              <span className="relative">Begin Journey</span>
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-full text-white/70 hover:text-white transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN ── */}
        {mobileOpen && (
          <div
            className="mt-2 rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(6,4,1,0.90)",
              backdropFilter: "blur(32px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] font-semibold text-white/65 hover:text-white hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <div className="px-4 py-3 flex gap-3">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-full border border-white/15 text-[0.65rem] uppercase tracking-widest text-white/70 font-bold"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-white/15 text-center text-[0.65rem] uppercase tracking-widest text-white/70 font-bold"
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/plan"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 rounded-full text-center text-[0.65rem] uppercase tracking-widest font-bold text-black"
                style={{ background: GOLD }}
              >
                Begin Journey
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
