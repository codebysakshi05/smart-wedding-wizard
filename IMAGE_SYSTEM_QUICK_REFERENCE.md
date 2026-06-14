# Image System - Quick Reference

## For Developers

### How to Use Images in Components

#### Option 1: Using Smart Getters (Recommended)

```tsx
import { getVenueImage, getDecorImage, getMandapImage } from "@/utils/assets";

// In component
const venueImg = getVenueImage("rajasthan", "premium");
const decorImg = getDecorImage("royal", "mid");
const mandapImg = getMandapImage("traditional", "premium");
```

#### Option 2: In Component JSX

```tsx
import SmartImage from "@/components/ui/SmartImage";

<SmartImage src={venueImage} alt="Venue" className="w-full h-full object-cover" />;
```

#### Option 3: Direct Image Tag (Auto-Transformed)

```tsx
import { getVenueImage } from "@/utils/assets";

<img
  src={getVenueImage("goa", "premium")}
  alt="Goa Venue"
  onError={(e) => handleImageFallback(e)}
/>;
```

### Available Getter Functions

```typescript
// Image Getters
getVenueImage(state, budget?)      // → /assets/venues/...
getDecorImage(theme, budget?)      // → /assets/decor/...
getOutfitImage(type, style?, budget?)
getMandapImage(style, budget?)
getStageImage(type, budget?)
getCategoryImage(category, budget?)
getServiceImage(category, budget?)
getPhotographyImage(style)
getFallbackImage()                 // → Global fallback

// Utility Functions
fixAssetPath(path)                 // Transform path
handleImageFallback(event)         // Error recovery
getAsset(path)                     // Generic asset path
```

### What Happens Behind the Scenes

1. **Getter function called** → `getVenueImage('kerala', 'premium')`
2. **Manifest lookup** → Finds exact path with correct extension
3. **Path transformation** → `fixAssetPath()` wraps result (usually pass-through)
4. **Component renders** → Image displays
5. **On error** → `handleImageFallback()` tries alternatives
6. **Final fallback** → Shows `/assets/fallback/...` if all fails

### Examples

#### Loading a Venue

```tsx
function VenueCard({ state }: { state: string }) {
  return <SmartImage src={getVenueImage(state, "premium")} alt={`${state} Venue`} />;
}
```

#### Loading Decor Options

```tsx
const themes = ["royal", "minimalist", "bohemian"];
{
  themes.map((theme) => <SmartImage key={theme} src={getDecorImage(theme, "mid")} alt={theme} />);
}
```

#### Loading Hero Images

```tsx
<SmartImage
  src={getHeroImage("homepage")}
  alt="Hero Background"
  className="w-full h-screen object-cover"
/>
```

## For System Admins

### Adding New Assets

1. **Add files** to `/public/assets/...`
2. **Update manifest**: Edit `src/data/assetManifest.json`
   ```json
   {
     "/assets/venues/newstate/premium": "/assets/venues/newstate/premium/venue-name/cover.webp",
     "/assets/decor/newtheme/mid": "/assets/decor/newtheme/mid/cover.avif"
   }
   ```
3. **Rebuild** with `npm run build`
4. **Deploy** - system automatically uses new paths

### Changing Path Structure

If you need to change from `/assets/` to something else:

1. **Edit `fixAssetPath()`** in `src/utils/fixAssetPath.js`

   ```javascript
   export const fixAssetPath = (path = "") => {
     if (!path) return "";

     // Old logic here...

     // New transformation
     if (path.startsWith("/assets/")) {
       return path.replace("/assets/", "/new-assets-location/");
     }

     return path;
   };
   ```

2. **Done** - Entire system updates automatically
3. No component changes needed

### Troubleshooting

#### Images show 404 in browser console

- Check `src/data/assetManifest.json` has the path
- Verify actual file exists in `/public/assets/`
- Check file extension in manifest matches real file

#### Wrong image displays

- Check manifest has correct path
- Verify no typos in state/category names
- Check budget parameter is valid

#### Image doesn't fade in

- Ensure SmartImage has `priority` prop if above fold
- Check `aspectRatio` prop is set correctly
- Verify image dimensions in manifest

### Performance Considerations

- **Manifest size**: Currently ~100KB (reasonable)
- **Lookup speed**: O(1) object lookup (instant)
- **Browser cache**: Images cached normally
- **No CDN needed**: Works with standard static serving

## Architecture Reference

```
fixAssetPath.js
  ↓ (wraps)
strictAssetResolver.ts
  ↓ (uses)
assetManifest.json
  ↓ (maps to)
/public/assets/
  ↓ (served as)
/assets/ URLs
```

## Common Paths

```
/assets/venues/[state]/[budget]/
/assets/decor/[theme]/[budget]/
/assets/outfits/[type]/[style]/
/assets/mandap/[style]/[budget]/
/assets/stage/[type]/[budget]/
/assets/categories/[category]/[budget]/
/assets/services/[service]/[budget]/
/assets/photography/[style]/
/assets/fallback/
```

## Future Enhancements

- [ ] Dynamic manifest generation during build
- [ ] Image optimization pipeline
- [ ] Lazy loading optimization
- [ ] WebP/AVIF prioritization
- [ ] CDN path transformation
- [ ] Image analytics tracking
