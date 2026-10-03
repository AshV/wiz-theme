/**
 * Media Registry — Mood-to-media mappings with deterministic hash selection.
 *
 * Background videos and ambient audio are mapped per mood. The selection
 * is deterministic: a quote's string ID is hashed (djb2) and modulo'd
 * against the mood's media pool, so a quote always gets the same visual.
 */

export type Mood =
  | 'reflective'
  | 'motivational'
  | 'serene'
  | 'bold'
  | 'melancholic'
  | 'joyful'
  | 'philosophical'
  | 'romantic';

export interface MediaEntry {
  gradient: string;
}

const BASE = '/wisdom';

/**
 * Mood → visual gradient pool.
 * Gradients are CSS class names applied for mood-specific aura styling.
 */
export const moodMedia: Record<Mood, MediaEntry[]> = {
  reflective: [{ gradient: 'gradient-reflective' }],
  motivational: [{ gradient: 'gradient-motivational' }],
  serene: [{ gradient: 'gradient-serene' }],
  bold: [{ gradient: 'gradient-bold' }],
  melancholic: [{ gradient: 'gradient-melancholic' }],
  joyful: [{ gradient: 'gradient-joyful' }],
  philosophical: [{ gradient: 'gradient-philosophical' }],
  romantic: [{ gradient: 'gradient-romantic' }],
};

/**
 * Mood → Zen chime audio track (play once on slide arrival).
 * Pristine 16-bit 44.1kHz Tibetan singing bowl strikes in public/media/audio/.
 */
export const moodAudio: Record<Mood, string> = {
  reflective: `${BASE}/media/audio/chime-reflective.wav`,
  motivational: `${BASE}/media/audio/chime-motivational.wav`,
  serene: `${BASE}/media/audio/chime-serene.wav`,
  bold: `${BASE}/media/audio/chime-bold.wav`,
  melancholic: `${BASE}/media/audio/chime-melancholic.wav`,
  joyful: `${BASE}/media/audio/chime-joyful.wav`,
  philosophical: `${BASE}/media/audio/chime-philosophical.wav`,
  romantic: `${BASE}/media/audio/chime-romantic.wav`,
};

/**
 * djb2 hash — fast, deterministic string hash.
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Get the deterministic media entry for a given quote.
 * Same ID + mood = same background, always.
 */
export function getMediaForQuote(id: string, mood: Mood): MediaEntry {
  const pool = moodMedia[mood];
  const index = djb2Hash(id) % pool.length;
  return pool[index];
}

/**
 * Get the ambient audio track for a given mood.
 */
export function getAudioForMood(mood: Mood): string {
  return moodAudio[mood];
}

/**
 * All mood values for iteration.
 */
export const allMoods: Mood[] = [
  'reflective',
  'motivational',
  'serene',
  'bold',
  'melancholic',
  'joyful',
  'philosophical',
  'romantic',
];

/**
 * Mood display names and emojis.
 */
export const moodMeta: Record<Mood, { label: string; emoji: string }> = {
  reflective: { label: 'Reflective', emoji: '🌙' },
  motivational: { label: 'Motivational', emoji: '🔥' },
  serene: { label: 'Serene', emoji: '🌊' },
  bold: { label: 'Bold', emoji: '⚡' },
  melancholic: { label: 'Melancholic', emoji: '🌧️' },
  joyful: { label: 'Joyful', emoji: '✨' },
  philosophical: { label: 'Philosophical', emoji: '🤔' },
  romantic: { label: 'Romantic', emoji: '💜' },
};
