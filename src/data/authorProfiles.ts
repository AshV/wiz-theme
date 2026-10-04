import { getTranslations } from '../i18n';

export interface AuthorWork {
  title: string;
  description: string;
}

export interface PhilosophicalPillar {
  concept: string;
  description: string;
}

export interface AuthorProfile {
  slug: string;
  name: string;
  shortName?: string;
  longName?: string;
  photo?: string;
  era: string;
  tradition: string;
  wikipediaUrl: string;
  summary: string;
  bio: string;
  keyWorks: AuthorWork[];
  pillars: PhilosophicalPillar[];
  whyTimeless: string;
}

export function getAuthorPhotoUrl(slug: string, customPhoto?: string, baseUrl: string = ''): string {
  if (customPhoto) return customPhoto;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}/media/authors/${slug}.webp`;
}

export const authorProfiles: Record<string, AuthorProfile> = {};

export function setAuthorProfiles(profiles: Record<string, AuthorProfile>) {
  Object.assign(authorProfiles, profiles);
}

export function getAuthorProfile(slug: string, fallbackName?: string, lang: string = 'en'): AuthorProfile {
  if (authorProfiles[slug]) return authorProfiles[slug];
  const name = fallbackName || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const t = getTranslations(lang);
  const isHi = lang.toLowerCase().startsWith('hi');
  const wikiLang = isHi ? 'hi' : 'en';

  return {
    slug,
    name,
    era: t.author?.defaultEra || 'Historical Thinker',
    tradition: t.author?.defaultTradition || 'Wisdom & Philosophy',
    wikipediaUrl: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`,
    summary: isHi
      ? `${name} के अनमोल दार्शनिक विचार और कालजयी सूक्तियां।`
      : `Curated philosophical reflections and timeless sayings from ${name}.`,
    bio: isHi
      ? `${name} एक प्रतिष्ठित एवं प्रभावशाली विचारक हैं, जिनके जीवन, लक्ष्य और दर्शन पर आधारित विचार आज भी मानवता का मार्गदर्शन करते हैं।`
      : `${name} is an influential thinker whose timeless reflections on life, purpose, and wisdom continue to inspire generations.`,
    keyWorks: [],
    pillars: [],
    whyTimeless: isHi
      ? `${name} के विचार मानवीय जीवन और आत्मा के शाश्वत सत्यों को उजागर करते हैं।`
      : `The insights of ${name} speak to enduring questions of human existence.`,
  };
}
