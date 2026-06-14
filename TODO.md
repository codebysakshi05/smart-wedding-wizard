# TODO — Vite Image System Fix

- [ ] Inspect current image resolver usage across pages/components/routes.
- [ ] Remove hardcoded image arrays/fallback sequences from `src/lib/weddingLoader.ts` (decorImages/ceremonyImages/outfitImages/venueImages).
- [ ] Remove hardcoded image arrays/fallback sequences from `src/data/curatedJourneys.ts` where they use static IMG arrays.
- [ ] Unify image resolution entrypoint to use the manifest-driven resolver and extension-aware gallery loader.
- [ ] Add/adjust gallery resolver to normalize lowercase paths and de-duplicate results.
- [ ] Ensure every page uses the same resolver utilities (no manual imports/renaming assumptions).
- [ ] Run typecheck/build and validate assets via existing scripts.

