export interface TypographyConfig {
  sansFont: string;
  quoteFont: string;
  displayFont: string;
  editorialFont: string;
  googleFontsUrl?: string;
  quoteCanvasFont?: string;
  authorCanvasFont?: string;
  sansCanvasFont?: string;
  fontsToPreload?: string[];
}

export const ENGLISH_TYPOGRAPHY: TypographyConfig = {
  sansFont: "'Inter', system-ui, -apple-system, sans-serif",
  quoteFont: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
  displayFont: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
  editorialFont: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap',
  quoteCanvasFont: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
  authorCanvasFont: 'italic 400 44px "Cormorant Garamond", "Playfair Display", Georgia, serif',
  sansCanvasFont: '"Inter", -apple-system, sans-serif',
  fontsToPreload: [
    '400 78px "Playfair Display"',
    'italic 400 100px "Playfair Display"',
    'italic 400 44px "Cormorant Garamond"',
    '500 20px "Inter"',
    '700 17px "Inter"',
  ],
};

export const HINDI_TYPOGRAPHY: TypographyConfig = {
  sansFont: "'Mukta', 'Noto Sans Devanagari', 'Inter', system-ui, sans-serif",
  quoteFont: "'Rozha One', 'Noto Serif Devanagari', 'Mukta', serif",
  displayFont: "'Rozha One', 'Noto Serif Devanagari', 'Mukta', serif",
  editorialFont: "'Noto Serif Devanagari', 'Rozha One', serif",
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&family=Rozha+One&display=swap',
  quoteCanvasFont: '"Rozha One", "Noto Serif Devanagari", serif',
  authorCanvasFont: '500 42px "Noto Serif Devanagari", serif',
  sansCanvasFont: '"Mukta", -apple-system, sans-serif',
  fontsToPreload: [
    '400 78px "Rozha One"',
    '500 42px "Noto Serif Devanagari"',
    '500 20px "Mukta"',
    '700 17px "Mukta"',
  ],
};

export const BUILT_IN_TYPOGRAPHY: Record<string, TypographyConfig> = {
  en: ENGLISH_TYPOGRAPHY,
  hi: HINDI_TYPOGRAPHY,
};

export function getTypographyConfig(
  lang: string = 'en',
  customConfig?: Partial<TypographyConfig>
): TypographyConfig {
  const normalizedLang = lang.toLowerCase().split(/[-_]/)[0] || 'en';
  const base = BUILT_IN_TYPOGRAPHY[normalizedLang] || BUILT_IN_TYPOGRAPHY.en;
  return {
    ...base,
    ...customConfig,
  };
}
