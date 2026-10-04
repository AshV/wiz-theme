/**
 * Shared utility for generating author initials.
 * Fully supports Unicode (Devanagari / Hindi, Sanskrit, Latin, etc.).
 *
 * Examples:
 * - "Maya Angelou" → "MA"
 * - "Rumi" → "R"
 * - "कबीर दास" → "कद"
 * - "स्वामी विवेकानंद" → "स्व"
 */
export function getAuthorInitials(name: string): string {
  if (!name) return '✦';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '✦';

  return parts
    .slice(0, 2)
    .map((part) => {
      // Use Array.from to safely get the first Unicode code point
      const chars = Array.from(part);
      return chars[0] || '';
    })
    .join('')
    .toUpperCase();
}
