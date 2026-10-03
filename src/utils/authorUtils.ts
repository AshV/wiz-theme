/**
 * Shared utility for generating author initials.
 *
 * Used in:
 * - Astro component frontmatter (server-side rendering)
 * - Client-side scripts via `getAuthorInitialsClient` (identical logic, kept local
 *   because `is:inline` scripts cannot import modules)
 *
 * Example: "Maya Angelou" → "MA", "Rumi" → "R"
 */
export function getAuthorInitials(name: string): string {
  if (!name) return 'W';
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
