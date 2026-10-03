import type { AstroIntegration } from 'astro';

export interface WizThemeOptions {
  siteTitle?: string;
}

export function wizTheme(options: WizThemeOptions = {}): AstroIntegration {
  return {
    name: 'wiz-theme',
    hooks: {
      'astro:config:setup': () => {
        // Theme initialization
      },
    },
  };
}

export default wizTheme;

// Layouts
export { default as BaseLayout } from './layouts/BaseLayout.astro';

// Components
export { default as ReelFeed } from './components/ReelFeed.astro';
export { default as ReelSlide } from './components/ReelSlide.astro';
export { default as GlobalBackground } from './components/GlobalBackground.astro';
export { default as QuoteDelveModal } from './components/QuoteDelveModal.astro';
export { default as AuthorDossierModal } from './components/AuthorDossierModal.astro';
export { default as ShareModal } from './components/ShareModal.astro';
export { default as DislikeFeedbackModal } from './components/DislikeFeedbackModal.astro';
export { default as ExploreDrawer } from './components/ExploreDrawer.astro';
export { default as RightActionRail } from './components/RightActionRail.astro';
export { default as ZenLoader } from './components/ZenLoader.astro';

// Utils & Data
export * from './utils/slug';
export * from './utils/chunkConfig';
export * from './utils/dailyQuote';
export * from './utils/authorUtils';
export * from './data/mediaRegistry';
export * from './data/exploreCatalog';
export * from './data/authorProfiles';
