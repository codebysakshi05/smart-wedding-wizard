import React from "react";
import SmartImage from "@/components/ui/SmartImage";
import {
  getCategoryImage,
  getVenueImage,
  getDecorImage,
  getHeroImage,
  getFallbackImage,
} from "@/utils/assets";

export default function ImageTestPage() {
  const testImages = [
    { label: "Category: Luxury (Premium)", path: getCategoryImage("luxury", "premium") },
    { label: "Category: Traditional (Mid)", path: getCategoryImage("traditional", "mid") },
    { label: "Decor: Wedding (Premium)", path: getDecorImage("wedding", "premium") },
    { label: "Decor: Haldi (Budget)", path: getDecorImage("haldi", "budget") },
    { label: "Hero: Homepage", path: getHeroImage("homepage") },
    { label: "Hero: Dashboard", path: getHeroImage("dashboard") },
    { label: "Fallback Image", path: getFallbackImage() },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Image Display Test</h1>
        <p className="text-gray-300 mb-8">
          Testing all image resolvers and ensuring images display correctly.
        </p>

        {/* Test Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testImages.map((img, idx) => (
            <div key={idx} className="group">
              <h3 className="text-lg font-semibold text-white mb-2">{img.label}</h3>
              <div className="bg-gray-700 rounded-lg overflow-hidden aspect-video border-2 border-gray-600 group-hover:border-blue-500 transition-colors">
                <SmartImage
                  path={img.path}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2 break-all font-mono">{img.path}</p>
            </div>
          ))}
        </div>

        {/* Manifest Info */}
        <div className="mt-12 bg-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Manifest Information</h2>
          <p className="text-gray-300">
            Images are resolved using{" "}
            <code className="bg-gray-800 px-2 py-1 rounded">assetManifest.json</code> which maps
            folder paths to actual image files in{" "}
            <code className="bg-gray-800 px-2 py-1 rounded">/public/assets/</code>.
          </p>
          <p className="text-gray-400 mt-4">
            The manifest ensures all image paths point to real files, with intelligent fallbacks if
            images are missing.
          </p>
        </div>
      </div>
    </div>
  );
}
