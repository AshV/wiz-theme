import type { Translations, DeepPartial } from '../i18n/types';
import { getTranslations } from '../i18n';
import type { TypographyConfig } from './typography';
import { getTypographyConfig } from './typography';

export interface WizThemeConfig {
  language?: string;
  locale?: string;
  dir?: 'ltr' | 'rtl';
  siteTitle?: string;
  siteName?: string;
  siteDescription?: string;
  subtitle?: string;
  tagline?: string;
  siteUrl?: string;
  base?: string;
  author?: string;
  brandingText?: string;
  typography?: Partial<TypographyConfig>;
  translations?: DeepPartial<Translations>;
}

export interface ResolvedThemeConfig {
  language: string;
  locale: string;
  dir: 'ltr' | 'rtl';
  siteTitle: string;
  siteName: string;
  siteDescription: string;
  subtitle: string;
  tagline: string;
  siteUrl: string;
  base: string;
  author: string;
  brandingText: string;
  typography: TypographyConfig;
  translations: Translations;
}

declare const __WIZ_THEME_INTEGRATION_OPTIONS__: WizThemeConfig | undefined;

export function getIntegrationConfig(): WizThemeConfig {
  if (typeof __WIZ_THEME_INTEGRATION_OPTIONS__ !== 'undefined') {
    return __WIZ_THEME_INTEGRATION_OPTIONS__;
  }
  return {};
}

const RTL_LANGUAGES = new Set(['ar', 'fa', 'ur', 'he']);

const DEFAULT_LOCALES: Record<string, string> = {
  en: 'en_US',
  hi: 'hi_IN',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  sa: 'sa_IN',
  ja: 'ja_JP',
  zh: 'zh_CN',
};

export function resolveThemeConfig(
  userConfig?: Partial<WizThemeConfig>
): ResolvedThemeConfig {
  const integrationConfig = getIntegrationConfig();
  const merged = { ...integrationConfig, ...userConfig };

  const language = merged.language || 'en';
  const normLang = language.toLowerCase().split(/[-_]/)[0];
  const locale = merged.locale || DEFAULT_LOCALES[normLang] || `${normLang}_${normLang.toUpperCase()}`;
  const dir = merged.dir || (RTL_LANGUAGES.has(normLang) ? 'rtl' : 'ltr');

  const translations = getTranslations(language, merged.translations);
  const typography = getTypographyConfig(language, merged.typography);

  const siteTitle = merged.siteName || merged.siteTitle || translations.site.title;
  const siteName = siteTitle;
  const subtitle = merged.subtitle || merged.tagline || translations.site.tagline;
  const tagline = subtitle;
  const siteDescription = merged.siteDescription || translations.site.description;
  const author = merged.author || translations.site.author;
  const brandingText = merged.brandingText || siteTitle || translations.site.brandingText;
  const siteUrl = merged.siteUrl || '';
  const base = merged.base !== undefined ? merged.base : '';

  return {
    language,
    locale,
    dir,
    siteTitle,
    siteName,
    subtitle,
    tagline,
    siteDescription,
    siteUrl,
    base,
    author,
    brandingText,
    typography,
    translations,
  };
}

export function defineWizConfig(config: WizThemeConfig): WizThemeConfig {
  return config;
}
