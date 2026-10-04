export type MoodKey =
  | 'reflective'
  | 'motivational'
  | 'serene'
  | 'bold'
  | 'melancholic'
  | 'joyful'
  | 'philosophical'
  | 'romantic';

export interface MoodTranslation {
  label: string;
  emoji: string;
}

export interface Translations {
  site: {
    title: string;
    description: string;
    author: string;
    brandingText: string;
    tagline: string;
  };
  header: {
    back: string;
  };
  slide: {
    moreAhead: string;
    delve: string;
    delveTitle: string;
    moreByAuthor: string;
    quoteMarkOpen: string;
    quoteMarkClose: string;
    srCategory: string;
    srMood: string;
    srTags: string;
  };
  rail: {
    like: string;
    dislike: string;
    share: string;
    audioMuted: string;
    audioActive: string;
    audioEnable: string;
    explore: string;
  };
  delve: {
    badge: string;
    title: string;
    loading: string;
    actionableInsight: string;
    dailyContemplation: string;
    exploreAuthor: string;
    shareCard: string;
    close: string;
  };
  author: {
    badge: string;
    about: string;
    curatedCount: string;
    exploreCta: string;
    shareLink: string;
    wikipedia: string;
    whyTimeless: string;
    bioTitle: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    worksTitle: string;
    worksSubtitle: string;
    notFound: string;
    defaultTradition: string;
    defaultEra: string;
    close: string;
  };
  dislike: {
    title: string;
    subtitle: string;
    selectReason: string;
    reasons: {
      wrongAuthor: string;
      typo: string;
      misquoted: string;
      lowQuality: string;
      other: string;
    };
    placeholder: string;
    skip: string;
    submit: string;
    thankYou: string;
    close: string;
  };
  share: {
    title: string;
    storyReel: string;
    keepsake: string;
    weaving: string;
    resolution: string;
    shareImage: string;
    copyImage: string;
    savePng: string;
    copyLink: string;
    copiedToast: string;
    linkCopiedToast: string;
    close: string;
  };
  explore: {
    title: string;
    installApp: string;
    searchAria: string;
    searchPlaceholder: string;
    tabs: {
      liked: string;
      moods: string;
      categories: string;
      authors: string;
      tags: string;
    };
    noLikedTitle: string;
    noLikedHint: string;
    noResultsTitle: string;
    noResultsHint: string;
    quickJumpTitle: string;
    openQuote: string;
    matchingLiked: string;
    matchingAuthors: string;
    matchingMoods: string;
    matchingCategories: string;
    matchingTags: string;
    clearFilter: string;
    exploreStream: string;
    sanctuaryTitle: string;
    sanctuaryDesc: string;
    exploreCta: string;
    quotesCountSuffix: string;
    singleQuoteSuffix: string;
    done: string;
    close: string;
  };
  pwa: {
    offlineSanctuary: string;
    installTitle: string;
    installDesc: string;
    later: string;
    install: string;
  };
  loader: {
    gatheringWisdom: string;
    loadingWisdom: string;
  };
  moods: Record<MoodKey, MoodTranslation>;
  emptyFeed: {
    noQuotes: string;
    returnToMaster: string;
  };
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
