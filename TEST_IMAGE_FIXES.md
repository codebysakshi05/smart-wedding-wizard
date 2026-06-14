# Image System Fix - Complete Implementation

## Problem Statement

The website had inconsistent image loading due to:

1. Images using `/assets/` paths but files being in different formats (`.webp`, `.avif` instead of `.jpg`)
2. No centralized path transformation mechanism
3. Some components accessing images directly without proper fallback handling
4. Asset manifest existing but not being used

## Solution Architecture

### Three-Layer Approach

#### Layer 1: Manifest-Based Resolution (Primary)

- **File**: `src/utils/strictAssetResolver.ts`
- **Function**: Uses pre-built manifest of all actual asset paths with correct extensions
- **Benefit**: Guarantees correct path from the start, no 404 errors
- **Files**: Exported from `src/utils/assets.ts` as primary exports

#### Layer 2: Path Transformation (Secondary)

- **File**: `src/utils/fixAssetPath.ts` & `.js`
- **Function**: Transforms old `/assets/` paths to new format if needed
- **Benefit**: Handles edge cases and future path changes globally
- **Wraps**: All paths before they reach the browser

#### Layer 3: Error Recovery (Tertiary)

- **File**: `src/utils/imageEngine.ts` (handleImageFallback)
- **Function**: Tries alternative file extensions and paths on 404
- **Benefit**: Last resort recovery mechanism
- **Chain**: `.webp` → `.avif` → no-dash variants → premium fallback → global fallback

### Component Flow

```
App Component
    ↓
Uses getter functions (getVenueImage, getDecorImage, etc.)
    ↓
assets.ts (re-exports)
    ↓
strictAssetResolver (manifest lookup)
    ↓
fixAssetPath wrapper (safety transform)
    ↓
Component (SmartImage or img tag)
    ↓
onError handler (handleImageFallback)
    ↓
Browser renders image or fallback
```

## Files Modified

### 1. src/utils/assets.ts

**Changes**:

- Now exports from `strictAssetResolver` instead of `imageEngine`
- Maintains backward compatibility with same function signatures
- All paths are wrapped with fixAssetPath before use

### 2. src/utils/strictAssetResolver.ts

**Changes**:

- Added import of `fixAssetPath`
- All returned paths wrapped with `fixAssetPath()`
- Provides manifest-based resolution with exact file paths

### 3. src/components/ui/SmartImage.tsx

**Changes**:

- Added import of `fixAssetPath`
- Initial src calculation wraps path with `fixAssetPath`
- Ensures all image paths go through transformation layer

### 4. src/components/hero/DynamicWeddingBackdrop.tsx

**Changes**:

- Added import of `fixAssetPath`
- BACKDROPS constant paths all wrapped with `fixAssetPath`
- Covers: hindu, muslim, christian, sikh, south-indian, default

### 5. src/routes/index.tsx

**Changes**:

- Fixed manifest fetch paths: `/assets/manifests/` → `/data/`
- All category images using getters which now resolve via manifest

## How It Works Now

### Example Flow: getVenueImage("rajasthan", "premium")

1. **App calls**: `getVenueImage("rajasthan", "premium")`

2. **Asset resolution**:
   - `strictAssetResolver.getVenueImage()` looks up manifest
   - Finds: `/assets/venues/rajasthan/premium` → exact real path like `/assets/venues/rajasthan/premium/taj-palace/cover.avif`

3. **Path transformation**:
   - Returned path wrapped with `fixAssetPath()`
   - If path already correct: passes through
   - If old format: transforms appropriately

4. **Component rendering**:
   - `SmartImage` receives path
   - Wraps with `fixAssetPath()` again (safety)
   - Renders with `<img src={fixedPath} onError={handleImageFallback} />`

5. **If image fails**:
   - `handleImageFallback` tries `.webp` → `.avif` → variants → fallback
   - Shows `/assets/fallback/...` if all else fails

## Key Benefits

✅ **No Manual Changes**: Old paths work globally through transformation  
✅ **Exact Paths**: Manifest ensures we never request non-existent files  
✅ **Flexible**: Works with any URL structure change  
✅ **Defensive**: Three-layer fallback system  
✅ **Consistent**: All components use same resolution path  
✅ **Maintainable**: Clear responsibility layers

## Testing Checklist

- [x] Manifest loaded and accessible
- [x] strictAssetResolver returns correct paths
- [x] fixAssetPath wrapping in place
- [x] SmartImage using fixAssetPath
- [x] DynamicWeddingBackdrop updated
- [x] Routes using new asset structure
- [x] All getter functions properly exported
- [ ] Website loads without 404 errors
- [ ] All images render with correct aspect ratios
- [ ] Cards display with hover effects
- [ ] Backgrounds apply correctly
- [ ] Results page shows all images
- [ ] Explore page displays image grid
- [ ] Dashboard shows venue/service images
- [ ] Plan page displays selection cards

## Files Structure Reference

```
src/
├── utils/
│   ├── fixAssetPath.js             (Transform layer)
│   ├── imageEngine.ts              (Fallback handler)
│   ├── assets.ts                   (Main exports - uses strictResolver)
│   └── strictAssetResolver.ts      (Manifest-based resolution)
├── components/
│   ├── ui/
│   │   ├── SmartImage.tsx          (Uses fixAssetPath)
│   │   ├── CategoryCard.tsx        (Uses SmartImage)
│   │   └── InspirationCard.tsx     (Uses SmartImage)
│   └── hero/
│       ├── WeddingBackground.tsx   (Uses fixAssetPath)
│       ├── DynamicWeddingScene.tsx (Uses SmartImage)
│       └── DynamicWeddingBackdrop.tsx (Uses fixAssetPath)
├── routes/
│   ├── index.tsx                   (Uses getters)
│   ├── editor.tsx                  (Uses getters)
│   ├── plan.tsx                    (Uses getters)
│   └── results.tsx                 (Uses SmartImage)
└── data/
    └── assetManifest.json          (Manifest of all assets)

public/
└── assets/
    ├── decor/
    ├── venues/
    ├── outfits/
    ├── mandap/
    ├── stage/
    ├── photography/
    ├── food/
    ├── entertainment/
    ├── services/
    ├── categories/
    ├── fallback/
    └── ...
```

## Deployment Notes

1. Ensure `public/assets/` folder is accessible at `/assets/` URL
2. Verify `src/data/assetManifest.json` is included in build
3. Test in production that `/assets/*` URLs resolve correctly
4. Monitor browser console for any image loading errors
5. Check that all image formats (webp, avif, jpg) are served with correct MIME types

## Future Improvements

1. Could lazy-load manifest for very large asset trees
2. Could add CDN path transformation in fixAssetPath
3. Could implement adaptive image serving based on client capabilities
4. Could add image optimization pipeline for new assets
