/**
 * Utility functions for generating human-readable, SEO-friendly quote slugs.
 */

/**
 * Generate a clean, natural-language URL slug from quote text.
 * E.g. "The earth has music for those who listen." → "the-earth-has-music-for-those-who-listen"
 */
export function slugifyQuote(content: string, maxWords = 10): string {
  const words = content
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove punctuation
    .trim()
    .split(/\s+/);
  return words.slice(0, Math.min(maxWords, words.length)).join('-');
}
