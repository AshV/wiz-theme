/**
 * Utility functions for generating human-readable, SEO-friendly quote slugs.
 * Fully supports Unicode (Devanagari/Hindi, Sanskrit, Latin, Cyrillic, etc.).
 */

/**
 * Generate a clean, natural-language URL slug from quote text in any language.
 * E.g.
 * English: "The earth has music for those who listen." → "the-earth-has-music-for-those-who-listen"
 * Hindi: "घाव वही जगह है जहां से रोशनी तुममें प्रवेश करती है।" → "घाव-वही-जगह-है-जहां-से-रोशनी-तुममें-प्रवेश-करती-है"
 */
export function slugifyQuote(content: string, maxWords = 10): string {
  if (!content) return 'quote';
  const words = content
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep all Unicode letters, numbers, whitespace, and hyphens
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return 'quote';
  return words.slice(0, Math.min(maxWords, words.length)).join('-');
}
