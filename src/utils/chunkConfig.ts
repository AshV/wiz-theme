/**
 * Chunk Configuration & Seeded Shuffle
 *
 * Deterministic Fisher-Yates shuffle using a seeded LCG PRNG.
 * Using a fixed seed means chunks and the lookup manifest are stable
 * across builds and CDN/browser caches (same build → same shuffle order).
 */

export const CHUNK_SIZE = 200;

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  // LCG parameters (same as glibc)
  let s = seed >>> 0;
  const next = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
