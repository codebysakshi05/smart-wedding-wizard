export const fixAssetPath = (path = "") => {
  if (!path) return "";

  // already correct
  if (path.includes("/wedding-data/assets/")) {
    return path;
  }

  // Keep current /assets/ paths as-is to avoid dev-time transform issues
  if (path.startsWith("/assets/")) {
    return path;
  }

  // missing leading slash for assets
  if (path.startsWith("assets/")) {
    return "/" + path;
  }

  return path;
};
