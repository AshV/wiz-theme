/**
 * Media Registry — Mood-to-media mappings with deterministic hash selection.
 *
 * Background visuals and ambient audio are mapped per mood. The selection
 * is deterministic: a quote's string ID is hashed (djb2) and modulo'd
 * against the mood's media pool, so a quote always gets the same visual.
 */
import { getTranslations } from '../i18n';

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
 * Mood filenames for ambient chimes.
 */
export const moodAudioFiles: Record<Mood, string> = {
  reflective: 'chime-reflective.wav',
  motivational: 'chime-motivational.wav',
  serene: 'chime-serene.wav',
  bold: 'chime-bold.wav',
  melancholic: 'chime-melancholic.wav',
  joyful: 'chime-joyful.wav',
  philosophical: 'chime-philosophical.wav',
  romantic: 'chime-romantic.wav',
};

/**
 * Legacy moodAudio map for backward compatibility.
 */
export const moodAudio: Record<Mood, string> = {
  reflective: '/media/audio/chime-reflective.wav',
  motivational: '/media/audio/chime-motivational.wav',
  serene: '/media/audio/chime-serene.wav',
  bold: '/media/audio/chime-bold.wav',
  melancholic: '/media/audio/chime-melancholic.wav',
  joyful: '/media/audio/chime-joyful.wav',
  philosophical: '/media/audio/chime-philosophical.wav',
  romantic: '/media/audio/chime-romantic.wav',
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
  const pool = moodMedia[mood] || moodMedia.reflective;
  const index = djb2Hash(id) % pool.length;
  return pool[index];
}

/**
 * Get the ambient audio track for a given mood, respecting custom baseUrl.
 */
export function getAudioForMood(mood: Mood, baseUrl: string = ''): string {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const file = moodAudioFiles[mood] || 'chime-reflective.wav';
  return `${cleanBase}/media/audio/${file}`;
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
 * Mood display names and emojis (English default).
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

/**
 * Get localized mood metadata (label + emoji) for a given language.
 */
export function getLocalizedMoodMeta(mood: Mood, lang: string = 'en'): { label: string; emoji: string } {
  const translations = getTranslations(lang);
  if (translations.moods && translations.moods[mood]) {
    return translations.moods[mood];
  }
  return moodMeta[mood] || { label: mood, emoji: '✦' };
}
