# wiz-theme

> High-performance immersive quote reel theme for **Astro** featuring dynamic shaders, ambient zen chimes, editorial modals, and full single-language script support (Hindi, Devanagari, English, and custom scripts).

---

## Features

- 📱 **Full-Screen Vertical Reels**: Smooth scroll-snap interaction, swipe gestures, double-tap to like, and full keyboard navigation.
- 🌐 **Single-Language Localization**: Dedicated support for Hindi (`hi`) and English (`en`), plus extensible translation dictionaries for any script or language (Tamil, Bengali, Arabic, etc.).
- ✍️ **Curated Typography Presets**:
  - **Hindi (Devanagari)**: *Rozha One* (headline display), *Noto Serif Devanagari* (editorial), and *Mukta* (modern UI sans).
  - **English (Latin)**: *Playfair Display*, *Cormorant Garamond*, and *Inter*.
  - Automatic Google Fonts stylesheet injection, zero-FOUT font preloading, and custom font override support.
- 🏷️ **Custom Site Name & Subtitle**: White-label the site title, subtitle, tagline, branding watermark, and SEO metadata via props or global config.
- 🎨 **High-Resolution Quote Card Generator**: Generates 9:16 Ultra-HD (2160×3840) social keepsake images via 2D Canvas with crisp Devanagari ligatures and font metrics.
- 🔍 **Universal Explore Drawer**: Instant multi-domain discovery across Authors, Moods, Categories, Tags, and Saved/Liked quotes.
- 📖 **Deep Philosophical Delve & Author Dossiers**: Actionable daily insights, reflection questions, thinker biographies, pillars, and sourced works.
- ⚡ **Offline-Ready PWA**: Fully functional offline contemplation with `localStorage` favorites.

---

## Installation

```bash
npm install wiz-theme
```

In your `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { wizTheme } from 'wiz-theme';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    wizTheme({
      siteName: 'सुविचार',
      subtitle: 'हर दिन नई प्रेरणा',
      siteDescription: 'संत कबीर, स्वामी विवेकानंद और गौतम बुद्ध के अनमोल विचार',
      brandingText: 'सुविचार',
      language: 'hi',
    }),
  ],
});
```

---

## Customizing Site Name, Subtitle & Branding

Theme consumers can customize the **site name**, **subtitle**, **tagline**, and **branding watermark** using any of the following approaches:

### 1. Via `BaseLayout` Props (Recommended for Pages)

Pass `siteName` (or `siteTitle`) and `subtitle` (or `tagline`) directly to `<BaseLayout>`:

```astro
---
import { BaseLayout, ReelFeed } from 'wiz-theme';

const quotes = [/* your quotes */];
---

<BaseLayout
  siteName="सुविचार"
  subtitle="अनमोल विचार और कोट्स"
  description="कबीर दास, स्वामी विवेकानंद और गौतम बुद्ध के अनमोल विचार"
  lang="hi"
>
  <ReelFeed
    quotes={quotes}
    feedTitle="सुविचार"
    feedSubtitle="हर दिन नई प्रेरणा"
  />
</BaseLayout>
```

When specified:
- `<title>` automatically formats as: `सुविचार — अनमोल विचार और कोट्स`
- Social OpenGraph (`og:site_name`, `og:title`) and Twitter card tags update automatically.
- Schema.org JSON-LD structured data adopts the site name and description.
- The top header bar displays both the site title and subtitle.
- Quote share cards embed your branding text as a crisp watermark.

### 2. Globally in `astro.config.mjs` (Recommended for the Entire Site)

Define the site configuration once in `astro.config.mjs`:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { wizTheme } from 'wiz-theme';

export default defineConfig({
  integrations: [
    wizTheme({
      siteName: 'अमृत विचार',
      subtitle: 'हर दिन नई प्रेरणा',
      siteDescription: 'संत कबीर, रहीम और विवेकानंद के अनमोल विचार',
      brandingText: 'अमृत विचार',
      language: 'hi',
    }),
  ],
});
```

All layouts and components inherit these settings automatically without having to pass props on every page.

### 3. In the Feed Header via `ReelFeed` Props

The reel feed header supports both a title and subtitle:

```astro
<ReelFeed
  quotes={quotes}
  feedTitle="सुविचार"
  feedSubtitle="हर दिन नई प्रेरणा"
/>
```

### 4. Via Translation Overrides

To customize site text within the translation dictionary:

```astro
<BaseLayout
  lang="hi"
  translations={{
    site: {
      title: 'सुविचार',
      tagline: 'हर दिन नई प्रेरणा',
      description: 'महान विचारकों के अनमोल विचार और कोट्स।',
    },
  }}
>
```

---

## Configuration Reference

You can pass configuration options either to `wizTheme({...})` in `astro.config.mjs` or as props to `<BaseLayout>`:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `siteName` / `siteTitle` | `string` | `'Wisdom'` / `'सुविचार'` | Brand or site name. Appears in `<title>`, OpenGraph tags, header, and structured data. |
| `subtitle` / `tagline` | `string` | `''` | Secondary site subtitle or motto. Automatically concatenated into `<title>` (`Site — Subtitle`). |
| `brandingText` | `string` | *(falls back to `siteName`)* | Watermark branding text printed at the bottom of generated 9:16 quote card images. |
| `description` | `string` | *Localized default* | Meta description tag, OpenGraph summary, and Schema.org description. |
| `lang` | `string` | `'en'` | Primary BCP-47 language tag (e.g., `'hi'`, `'en'`, `'es'`). Automatically selects built-in dictionary & typography. |
| `locale` | `string` | `'en_US'` / `'hi_IN'` | OpenGraph locale (e.g. `hi_IN`, `en_US`, `es_ES`). |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Reading direction. Automatically set to `'rtl'` for Arabic (`ar`), Urdu (`ur`), Persian (`fa`), Hebrew (`he`). |
| `base` | `string` | `''` | Subpath base URL if deploying to a subfolder (e.g., `'/quotes'`). Defaults to domain root. |
| `siteUrl` | `string` | `Astro.site` | Fully qualified production URL used for canonical URLs and absolute social share links. |
| `author` | `string` | `'Wisdom'` | Author or curator attribution used in Schema.org structured data. |
| `typography` | `Partial<TypographyConfig>` | *Language preset* | Font family overrides and Google Fonts stylesheet URL. |
| `translations` | `DeepPartial<Translations>` | *Language dictionary* | Custom string and label overrides for any component or modal. |

### ReelFeed Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `quotes` | `QuoteData[]` | *(required)* | Array of quote objects to render in the vertical snap reel feed. |
| `feedTitle` | `string` | *(inherits `siteName`)* | Title displayed in the top fixed navigation bar. |
| `feedSubtitle` / `subtitle` | `string` | *(inherits `subtitle`)* | Subtitle displayed directly beneath the feed title in the top bar. |
| `lang` | `string` | *(inherits `lang`)* | Language code for localized buttons, tooltips, and drawer controls. |
| `translations` | `DeepPartial<Translations>` | `undefined` | Optional localized string overrides for the feed and child modals. |

---

## Creating a Dedicated Hindi Site

To build a website dedicated to Hindi, simply set `lang="hi"` on `<BaseLayout>`:

```astro
---
// src/pages/index.astro
import { BaseLayout, ReelFeed } from 'wiz-theme';

const hindiQuotes = [
  {
    id: "q-hi-001",
    content: "पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय। ढाई आखर प्रेम का, पढ़े सो पंडित होय॥",
    author: "कबीर दास",
    authorSlug: "kabir",
    category: "प्रेम व ज्ञान",
    categorySlug: "love-wisdom",
    mood: "philosophical",
    tags: ["प्रेम", "ज्ञान", "भक्ति", "सत्य"],
    duration: 8,
    sourceWork: "कबीर ग्रंथावली",
    explanation: "कबीर बाहरी पाखंड और कोरी किताबी शिक्षा पर गहरी चोट करते हैं।",
    practicalInsight: "सहानुभूति और प्रेम से दूसरों को समझें।"
  }
];
---

<BaseLayout
  siteName="सुविचार"
  subtitle="अनमोल विचार और कोट्स"
  description="संत कबीर, स्वामी विवेकानंद और गौतम बुद्ध के अनमोल विचार"
  lang="hi"
>
  <ReelFeed
    quotes={hindiQuotes}
    feedTitle="सुविचार"
    feedSubtitle="हर दिन नई प्रेरणा"
    lang="hi"
  />
</BaseLayout>
```

The theme automatically:
1. Applies **modern, natural Hindi labels** across all buttons, tooltips, dialogs, drawers, and notifications (`शेयर करें`, `लाइक करें`, `विस्तार से जानें`, `काम की बात (सीख)`, `आज का सवाल`, `मूड`, `कैटेगरी`, `लेखक`, etc.).
2. Loads optimized **Devanagari Google Fonts** (*Rozha One*, *Noto Serif Devanagari*, *Mukta*).
3. Preserves **Unicode Devanagari slugs** (e.g. `/#पोथी-पढि-पढि-जग-मुआ`) without stripping characters.
4. Generates **2D Canvas Quote Cards** with Devanagari font rendering and ligatures.

---

## Creating Sites for Other Languages

To create a site dedicated to another language (e.g., Spanish, Sanskrit, Arabic):

```astro
---
import { BaseLayout, ReelFeed } from 'wiz-theme';
---

<BaseLayout
  lang="ar"
  dir="rtl"
  siteName="حكمة"
  subtitle="تأملات يومية"
  typography={{
    sansFont: "'Amiri', system-ui, sans-serif",
    quoteFont: "'Amiri', serif",
    displayFont: "'Amiri', serif",
    editorialFont: "'Amiri', serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap",
    quoteCanvasFont: '"Amiri", serif',
    authorCanvasFont: '500 42px "Amiri", serif',
    sansCanvasFont: '"Amiri", sans-serif',
    fontsToPreload: ['400 78px "Amiri"'],
  }}
  translations={{
    header: { back: 'رجوع' },
    slide: { delve: 'تعمق', moreAhead: 'المزيد من الحكم' },
    rail: { share: 'مشاركة', like: 'إعجاب' },
    explore: { title: 'استكشاف', tabs: { authors: 'المؤلفون', moods: 'الحالات' } },
  }}
>
  <ReelFeed quotes={arabicQuotes} />
</BaseLayout>
```

---

## Quote Data Schema

Each quote object adheres to the following structure:

```typescript
interface QuoteData {
  id: string;                    // e.g. "q-001"
  content: string;               // The quote text
  author: string;                // Author display name
  authorSlug: string;            // URL-safe author identifier
  category: string;              // Category display name
  categorySlug: string;          // Category identifier
  mood:                          // One of 8 core emotional moods:
    | 'reflective'
    | 'motivational'
    | 'serene'
    | 'bold'
    | 'melancholic'
    | 'joyful'
    | 'philosophical'
    | 'romantic';
  tags: string[];                // Topic tags, e.g. ["सत्य", "ज्ञान"]
  duration?: number;             // Auto-scroll duration in seconds (default: 8)
  sourceWork?: string;           // Book or treatise citation
  explanation?: string;          // In-depth philosophical meaning
  practicalInsight?: string;     // Daily actionable takeaway
  reflectionPrompt?: string;     // Thought-provoking daily question
}
```

---

## License

MIT © [Ashish Vishwakarma](https://www.ashishvishwakarma.com)
