/**
 * fixImagePaths.ts
 * ================
 * Loads the pre-generated asset manifest (src/data/assetManifest.json)
 * which maps real folder paths to real file URLs scanned from public/assets/.
 *
 * This is the ONLY correct way to resolve public/ assets in Vite —
 * import.meta.glob does NOT work for /public/ and must not be used.
 */

import MANIFEST from "@/data/assetManifest.json";

const manifest: Record<string, string> = MANIFEST;

/**
 * Exact folder lookup.
 * e.g. autoResolveImage('/assets/categories/beach/mid')
 *   → '/assets/categories/beach/mid/cover.webp'
 */
export function autoResolveImage(folderPath: string): string | null {
  if (!folderPath) return null;

  // Normalize: ensure leading slash, no trailing slash, lowercase
  const key = ("/" + folderPath.replace(/^\/+/, "").replace(/\/+$/, "")).toLowerCase();

  // 1. Exact match
  if (manifest[key]) return manifest[key];

  // 2. Prefix match — find first manifest key that starts with key + '/'
  // Useful when slug is unknown but we have state/tier
  const prefixKey = key.endsWith("/") ? key : key + "/";
  const prefixMatch = Object.keys(manifest).find((k) => k.startsWith(prefixKey));
  if (prefixMatch) return manifest[prefixMatch];

  return null;
}

/**
 * Get all image URLs whose folder path starts with the given prefix.
 * Useful for galleries.
 */
export function autoResolveGallery(folderPath: string): string[] {
  if (!folderPath) return [];
  const key = ("/" + folderPath.replace(/^\/+/, "").replace(/\/+$/, "")).toLowerCase();
  const prefixKey = key + "/";
  return Object.entries(manifest)
    .filter(([k]) => k === key || k.startsWith(prefixKey))
    .map(([, v]) => v);
}
