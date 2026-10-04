import type { Translations, DeepPartial } from './types';
import { enTranslations } from './locales/en';
import { hiTranslations } from './locales/hi';

export * from './types';
export { enTranslations } from './locales/en';
export { hiTranslations } from './locales/hi';

export const builtInTranslations: Record<string, Translations> = {
  en: enTranslations,
  hi: hiTranslations,
};

function deepMerge<T extends Record<string, any>>(target: T, source?: DeepPartial<T>): T {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const val = source[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      output[key] = deepMerge(output[key] || ({} as any), val as any);
    } else if (val !== undefined) {
      output[key] = val as any;
    }
  }
  return output;
}

/**
 * Resolve translations for the given language code, falling back to English
 * and applying any custom overrides provided by the site creator.
 */
export function getTranslations(
  lang: string = 'en',
  customOverrides?: DeepPartial<Translations>
): Translations {
  const normalizedLang = lang.toLowerCase().split(/[-_]/)[0] || 'en';
  const baseDict = builtInTranslations[normalizedLang] || builtInTranslations.en;
  return deepMerge(baseDict, customOverrides);
}
