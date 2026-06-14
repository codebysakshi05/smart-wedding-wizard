/**
 * dynamicImageResolver.ts
 * =======================
 * All image helper functions backed by the static asset manifest.
 * Uses autoResolveImage() from fixImagePaths.ts which does exact + prefix lookup.
 * Guarantees NO broken image URLs — always returns a real file path or a fallback.
 */

import { autoResolveImage, autoResolveGallery } from "./fixImagePaths";

// ─── Fallback ─────────────────────────────────────────────────────────────────
// Use a real file that exists in the manifest
const UNIVERSAL_FALLBACK = "/assets/fallback/cover.webp";

function uniqStable(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    if (!x) continue;
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

export function getFallbackImage(type: string = "default"): string {
  return UNIVERSAL_FALLBACK;
}

// ─── Internal helper ─────────────────────────────────────────────────────────
function resolve(folder: string, fallbackType: string = "default"): string {
  const url = autoResolveImage(folder);
  return url ?? UNIVERSAL_FALLBACK;
}

// ─── Category ─────────────────────────────────────────────────────────────────
// Structure: /assets/categories/{category}/{tier}/
export function getCategoryImage(category: string, tier: string = "mid"): string {
  if (!category) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/categories/${category.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Venue ────────────────────────────────────────────────────────────────────
// Structure: /assets/venues/{state}/{tier}/{slug}/
// If the exact slug doesn't exist, falls back to any venue in state/tier
export function getVenueImage(state: string, tier: string = "mid", slug?: string): string {
  if (!state) return UNIVERSAL_FALLBACK;
  const s = state.toLowerCase();
  const t = tier.toLowerCase();

  // Try exact slug first
  if (slug) {
    const exact = autoResolveImage(`/assets/venues/${s}/${t}/${slug.toLowerCase()}`);
    if (exact) return exact;
  }

  // Fallback: pick any venue in state/tier
  const any = autoResolveImage(`/assets/venues/${s}/${t}`);
  if (any) return any;

  // Fallback: any venue in state
  const anyTier = autoResolveImage(`/assets/venues/${s}`);
  if (anyTier) return anyTier;

  return UNIVERSAL_FALLBACK;
}

// ─── Decor ────────────────────────────────────────────────────────────────────
// Structure: /assets/decor/{eventType}/{tier}/
export function getDecorImage(eventType: string, tier: string = "mid"): string {
  if (!eventType) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/decor/${eventType.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Outfit ───────────────────────────────────────────────────────────────────
// Structure: /assets/outfits/{who}/{type}/{tier}/
export function getOutfitImage(who: string, type: string, tier: string = "mid"): string {
  if (!who || !type) return UNIVERSAL_FALLBACK;
  return resolve(
    `/assets/outfits/${who.toLowerCase()}/${type.toLowerCase()}/${tier.toLowerCase()}`,
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Structure: /assets/hero/{page}/
export function getHeroImage(page: string): string {
  if (!page) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/hero/${page.toLowerCase()}`);
}

// ─── Food ─────────────────────────────────────────────────────────────────────
// Structure: /assets/food/{type}/
export function getFoodImage(type: string): string {
  if (!type) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/food/${type.toLowerCase()}`);
}

// ─── Service ──────────────────────────────────────────────────────────────────
// Structure: /assets/services/{category}/{tier}/{slug}/
// Prefix-matches so any service in category/tier works
export function getServiceImage(category: string, tier: string = "mid", slug?: string): string {
  if (!category) return UNIVERSAL_FALLBACK;
  const c = category.toLowerCase();
  const t = tier.toLowerCase();

  if (slug) {
    const exact = autoResolveImage(`/assets/services/${c}/${t}/${slug.toLowerCase()}`);
    if (exact) return exact;
  }

  // Pick first service in category/tier
  return resolve(`/assets/services/${c}/${t}`);
}

// ─── Mandap ───────────────────────────────────────────────────────────────────
export function getMandapImage(style: string, tier: string = "mid"): string {
  if (!style) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/mandap/${style.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Stage ────────────────────────────────────────────────────────────────────
export function getStageImage(eventType: string, tier: string = "mid"): string {
  if (!eventType) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/stage/${eventType.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Photography ──────────────────────────────────────────────────────────────
export function getPhotographyImage(style: string): string {
  if (!style) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/photography/${style.toLowerCase()}`);
}

// ─── Invitation ───────────────────────────────────────────────────────────────
export function getInvitationImage(style: string, tier: string = "mid"): string {
  if (!style) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/invitations/${style.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Jewelry ──────────────────────────────────────────────────────────────────
export function getJewelryImage(type: string, tier: string = "mid"): string {
  if (!type) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/jewelry/${type.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Makeup ───────────────────────────────────────────────────────────────────
export function getMakeupImage(type: string, tier: string = "mid"): string {
  if (!type) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/makeup/${type.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Entertainment ────────────────────────────────────────────────────────────
export function getEntertainmentImage(type: string): string {
  if (!type) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/entertainment/${type.toLowerCase()}`);
}

// ─── Ideas ────────────────────────────────────────────────────────────────────
export function getIdeasImage(category: string, tier: string = "mid"): string {
  if (!category) return UNIVERSAL_FALLBACK;
  return resolve(`/assets/ideas/${category.toLowerCase()}/${tier.toLowerCase()}`);
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export function getGallery(folderPath: string): string[] {
  const results = autoResolveGallery(folderPath);
  const unique = uniqStable(results);
  return unique.length > 0 ? unique : [UNIVERSAL_FALLBACK];
}

// ─── Generic utilities ────────────────────────────────────────────────────────
export function resolveAutoImage(
  path: string | null | undefined,
  type: string = "default",
): string {
  if (!path) return UNIVERSAL_FALLBACK;
  const result = autoResolveImage(path);
  return result ?? UNIVERSAL_FALLBACK;
}

export function resolveImageWithFallback(
  imagePath: string | null | undefined,
  fallback: string = UNIVERSAL_FALLBACK,
): string {
  if (imagePath && imagePath.trim()) return imagePath;
  return fallback;
}
