/**
 * utils/imageMemory.js
 * Tracks generated images and prompts to prevent duplicates.
 */

class ImageMemory {
  constructor() {
    this.usedUrls = new Set();
    this.usedPrompts = new Set();
  }

  isDuplicate(url, prompt) {
    if (url && this.usedUrls.has(url)) return true;
    if (prompt && this.usedPrompts.has(prompt)) return true;
    return false;
  }

  track(url, prompt) {
    if (url) this.usedUrls.add(url);
    if (prompt) this.usedPrompts.add(prompt);
  }

  clear() {
    this.usedUrls.clear();
    this.usedPrompts.clear();
  }
}

// Singleton instance
const globalMemory = new ImageMemory();

module.exports = globalMemory;
