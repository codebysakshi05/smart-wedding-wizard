/\*\*

- Image System Implementation Examples
- ====================================
-
- Common use cases and patterns for the Universal Image Detection System
  \*/

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

/\*\*

- Example 1: Display a category card with automatic image detection
  \*/
  import { getCategoryImage } from '@/utils/assets';
  import SmartImage from '@/components/ui/SmartImage';

export function CategoryCard({ name, tier }: { name: string; tier: string }) {
// System automatically finds ANY image file in the folder
const image = getCategoryImage(name, tier);

return (

<div className="relative w-full h-64 rounded-lg overflow-hidden">
<SmartImage
path={image}
alt={`${name} category`}
className="w-full h-full object-cover"
fallbackType="category"
/>
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
<h3 className="text-white font-bold">{name}</h3>
</div>
</div>
);
}

// Usage:
// <CategoryCard name="luxury" tier="premium" />
// Works even if the image is named: cover.jpg, Cover.png, image.webp, etc.

// ============================================================================
// VENUE SELECTION
// ============================================================================

/\*\*

- Example 2: Venue card with state, tier, and slug
  \*/
  export function VenueCard({
  name,
  state,
  tier,
  slug,
  }: {
  name: string;
  state: string;
  tier: string;
  slug: string;
  }) {
  const { getVenueImage } = require('@/utils/assets');
  const image = getVenueImage(state, tier, slug);

return (

<div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
<div className="relative w-full h-48">
<SmartImage
          path={image}
          alt={name}
          className="w-full h-full object-cover"
          fallbackType="venue"
          priority={false}
        />
</div>
<div className="p-4">
<h3 className="font-bold text-lg">{name}</h3>
<p className="text-gray-600">{state}</p>
</div>
</div>
);
}

// Usage:
// <VenueCard
// name="Taj Mahal Palace"
// state="rajasthan"
// tier="premium"
// slug="taj-mahal"
// />

// ============================================================================
// OUTFIT GALLERY
// ============================================================================

/\*\*

- Example 3: Outfit selection with multiple options
  \*/
  export function OutfitGallery({
  who,
  outfits,
  tier,
  }: {
  who: 'bride' | 'groom';
  outfits: string[];
  tier: 'budget' | 'mid' | 'premium';
  }) {
  const { getOutfitImage } = require('@/utils/assets');

return (

<div className="grid grid-cols-3 gap-4">
{outfits.map((outfit) => (
<div key={outfit} className="rounded-lg overflow-hidden">
<SmartImage
path={getOutfitImage(who, outfit, tier)}
alt={`${who} ${outfit}`}
className="w-full aspect-square object-cover"
fallbackType="outfit"
/>
<p className="text-center mt-2 capitalize">{outfit}</p>
</div>
))}
</div>
);
}

// Usage:
// <OutfitGallery
// who="bride"
// outfits={['lehenga', 'saree', 'sharara']}
// tier="premium"
// />

// ============================================================================
// DYNAMIC IMAGE RESOLUTION
// ============================================================================

/\*\*

- Example 4: Get images based on wedding religion/theme
  \*/
  import {
  getDecorImage,
  getOutfitImage,
  getFallbackImage,
  } from '@/utils/assets';

export function getWeddingImages(religion: string, theme: string, tier: string) {
// Map religion to decor style
const decorMap: Record<string, string> = {
hindu: 'traditional',
muslim: 'luxury',
christian: 'minimal',
sikh: 'traditional',
south_indian: 'floral',
};

const decor = decorMap[religion.toLowerCase()] || 'royal';

// Map religion to outfit style
const outfitStyles: Record<string, { bride: string; groom: string }> = {
hindu: { bride: 'lehenga', groom: 'sherwani' },
muslim: { bride: 'sharara', groom: 'sherwani' },
christian: { bride: 'bridal-gown', groom: 'tuxedo' },
sikh: { bride: 'lehenga', groom: 'sherwani' },
south_indian: { bride: 'saree', groom: 'veshti' },
};

const selectedOutfit = outfitStyles[religion.toLowerCase()] || {
bride: 'lehenga',
groom: 'sherwani',
};

return {
decor: getDecorImage(decor, tier),
brideOutfit: getOutfitImage('bride', selectedOutfit.bride, tier),
groomOutfit: getOutfitImage('groom', selectedOutfit.groom, tier),
};
}

// Usage:
// const images = getWeddingImages('hindu', 'modern', 'premium');
// console.log(images.decor); // → /assets/decor/traditional/premium/[image]
// console.log(images.brideOutfit); // → /assets/outfits/bride/lehenga/premium/[image]

// ============================================================================
// FALLBACK HANDLING
// ============================================================================

/\*\*

- Example 5: Using fallback images with type safety
  \*/
  import { getFallbackImage } from '@/utils/assets';

export function ImageWithFallback({
path,
type,
}: {
path?: string;
type: 'venue' | 'decor' | 'outfit' | 'food' | 'default';
}) {
const finalPath = path || getFallbackImage(type);

return (

<div className="w-full h-48">
<SmartImage
        path={finalPath}
        alt="Wedding image"
        className="w-full h-full object-cover rounded-lg"
        fallbackType={type}
      />
</div>
);
}

// Usage:
// <ImageWithFallback path={undefined} type="venue" />
// Always shows an image, never broken

// ============================================================================
// GRID DISPLAY WITH MULTIPLE IMAGES
// ============================================================================

/\*\*

- Example 6: Display grid of decor options
  \*/
  export function DecorGalleryGrid({ tier }: { tier: string }) {
  const { getDecorImage } = require('@/utils/assets');
  const decors = [
  'royal',
  'floral',
  'luxury',
  'traditional',
  'minimal',
  ];

return (

<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
{decors.map((decor) => (
<div key={decor} className="aspect-square rounded-lg overflow-hidden shadow-md">
<SmartImage
path={getDecorImage(decor, tier)}
alt={decor}
className="w-full h-full object-cover"
fallbackType="decor"
/>
<div className="absolute bottom-0 inset-x-0 bg-black/50 text-white p-2 text-sm font-semibold capitalize">
{decor}
</div>
</div>
))}
</div>
);
}

// Usage:
// <DecorGalleryGrid tier="premium" />
// Shows all decor options with automatic image detection

// ============================================================================
// HERO IMAGE WITH LAZY LOADING
// ============================================================================

/\*\*

- Example 7: Hero image for page headers (use priority loading)
  \*/
  import { getHeroImage } from '@/utils/assets';

export function PageHero({ page }: { page: string }) {
const image = getHeroImage(page);

return (

<div className="relative w-full h-96">
<SmartImage
path={image}
alt={`${page} hero image`}
className="w-full h-full object-cover"
fallbackType="hero"
priority={true} // Use eager loading for above-the-fold images
/>
<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
<h1 className="text-4xl font-bold text-white capitalize">{page}</h1>
</div>
</div>
);
}

// Usage:
// <PageHero page="explore" />

// ============================================================================
// CONDITIONAL IMAGE LOADING
// ============================================================================

/\*\*

- Example 8: Load different images based on user selections
  \*/
  export function DynamicWeddingPreview({
  religion,
  theme,
  budgetTier,
  }: {
  religion: string;
  theme: string;
  budgetTier: string;
  }) {
  const { getDecorImage, getVenueImage } = require('@/utils/assets');

// Images update whenever selections change
const decorImage = getDecorImage(theme, budgetTier);
const venueImage = getVenueImage('rajasthan', budgetTier, 'taj-mahal');

return (

<div className="grid grid-cols-2 gap-4">
<div>
<p className="mb-2 font-semibold">Decor</p>
<SmartImage
          path={decorImage}
          alt="Decor preview"
          className="w-full h-48 object-cover rounded"
          fallbackType="decor"
        />
</div>
<div>
<p className="mb-2 font-semibold">Venue</p>
<SmartImage
          path={venueImage}
          alt="Venue preview"
          className="w-full h-48 object-cover rounded"
          fallbackType="venue"
        />
</div>
</div>
);
}

// Usage:
// <DynamicWeddingPreview
// religion="hindu"
// theme="royal"
// budgetTier="premium"
// />

// ============================================================================
// CACHE MANAGEMENT (Advanced)
// ============================================================================

/\*\*

- Example 9: Manual cache management for dynamic content
  \*/
  import {
  preloadImages,
  clearImageCache,
  getImageCacheStats,
  } from '@/utils/assets';

export function ImageCacheManager() {
const handlePreload = () => {
// Preload specific folder for faster access
preloadImages('/assets/categories');
preloadImages('/assets/venues');
console.log('Images preloaded');
};

const handleClearCache = () => {
clearImageCache();
console.log('Cache cleared');
};

const handleShowStats = () => {
const stats = getImageCacheStats();
console.log(`Cached ${stats.size} folders`);
};

return (

<div className="space-y-2">
<button onClick={handlePreload} className="btn btn-primary">
Preload Images
</button>
<button onClick={handleClearCache} className="btn btn-secondary">
Clear Cache
</button>
<button onClick={handleShowStats} className="btn btn-info">
Show Stats
</button>
</div>
);
}

// ============================================================================
// SERVICE/VENDOR LISTING
// ============================================================================

/\*\*

- Example 10: Display vendors/services with images
  \*/
  import { getServiceImage } from '@/utils/assets';

export function VendorCard({
name,
category,
slug,
tier,
}: {
name: string;
category: string;
slug: string;
tier: string;
}) {
const image = getServiceImage(category, tier, slug);

return (

<div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
<SmartImage
        path={image}
        alt={name}
        className="w-full h-40 object-cover"
        fallbackType="service"
      />
<div className="p-4">
<h3 className="font-bold">{name}</h3>
<p className="text-sm text-gray-600">{category}</p>
</div>
</div>
);
}

// Usage:
// <VendorCard
// name="Cinematic Studio"
// category="photography"
// slug="cinematic"
// tier="premium"
// />

// ============================================================================
// ERROR BOUNDARY WRAPPER
// ============================================================================

/\*\*

- Example 11: Error boundary for image loading failures
  \*/
  import React from 'react';

export class ImageErrorBoundary extends React.Component<
{ children: React.ReactNode },
{ hasError: boolean }

> {
> constructor(props: { children: React.ReactNode }) {

    super(props);
    this.state = { hasError: false };

}

static getDerivedStateFromError() {
return { hasError: true };
}

componentDidCatch(error: Error) {
console.error('Image loading error:', error);
}

render() {
if (this.state.hasError) {
return (

<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
<p className="text-gray-600">Unable to load image</p>
</div>
);
}

    return this.props.children;

}
}

// Usage:
// <ImageErrorBoundary>
// <SmartImage path={imagePath} alt="Wedding" />
// </ImageErrorBoundary>
