/**
 * assetImageLoader.ts
 * =====================
 * Single source of truth for image resolution from public/assets.
 * - Extension detection is handled by the manifest (scanned files)
 * - Paths are normalized to lowercase
 * - Galleries are de-duplicated
 */

import { autoResolveImage, autoResolveGallery } from "./fixImagePaths";

const FALLBACK = "/assets/fallback/cover.webp";

function normalizePath(p: string): string {
  return ("/" + (p || "").replace(/^\/+/, "").replace(/\/+$/, "")).toLowerCase();
}

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

export function resolveImage(folderOrUrlPath: string | null | undefined): string {
  if (!folderOrUrlPath) return FALLBACK;
  const key = normalizePath(folderOrUrlPath);
  return autoResolveImage(key) ?? FALLBACK;
}

export function resolveGallery(folderPath: string | null | undefined): string[] {
  if (!folderPath) return [FALLBACK];
  const key = normalizePath(folderPath);
  const results = autoResolveGallery(key);
  const unique = uniqStable(results);
  return unique.length ? unique : [FALLBACK];
}
