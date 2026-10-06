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
- 🛠️ **Built-In Local Admin UI**: Manage quotes, authors, tags, and categories via a local browser dashboard (`npx wiz-theme admin`) with 4 themes and live search.
- 🎬 **Bulk Video Generator CLI**: Automated batch export of animated 9:16 vertical social videos (1080×1920) across all quotes using headless Puppeteer.
- 📊 **Firebase Telemetry & Quality Audit**: Multi-site engagement telemetry (views, likes, shares, dossier reads, and feedback) isolated per consumer identifier with live audit dashboard.
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
      siteName: 'तत्व',
      subtitle: 'जीवन का सार',
      siteDescription: 'संत कबीर, स्वामी विवेकानंद और गौतम बुद्ध के अनमोल विचार — जीवन का सार',
      brandingText: 'तत्व',
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
  siteName="तत्व"
  subtitle="जीवन का सार"
  description="संत कबीर, स्वामी विवेकानंद और गौतम बुद्ध के अनमोल विचार — जीवन का सार"
  lang="hi"
>
  <ReelFeed
    quotes={quotes}
    feedTitle="तत्व"
    feedSubtitle="जीवन का सार"
  />
</BaseLayout>
```

When specified:
- `<title>` automatically formats as: `तत्व — जीवन का सार`
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
  feedTitle="तत्व"
  feedSubtitle="जीवन का सार"
/>
```

### 4. Via Translation Overrides

To customize site text within the translation dictionary:

```astro
<BaseLayout
  lang="hi"
  translations={{
    site: {
      title: 'तत्व',
      tagline: 'जीवन का सार',
      description: 'महान विचारकों के अनमोल विचार और जीवन का सार।',
    },
  }}
>
```

---

## Configuration Reference

You can pass configuration options either to `wizTheme({...})` in `astro.config.mjs` or as props to `<BaseLayout>`:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `siteName` / `siteTitle` | `string` | `'Wisdom'` / `'तत्व'` | Brand or site name. Appears in `<title>`, OpenGraph tags, header, and structured data. |
| `subtitle` / `tagline` | `string` | `''` | Secondary site subtitle or motto. Automatically concatenated into `<title>` (`Site — Subtitle`). |
| `brandingText` | `string` | *(falls back to `siteName`)* | Watermark branding text printed at the bottom of generated 9:16 quote card images. |
| `consumerId` / `siteId` | `string` | *(derived slug)* | Top-level namespace identifier in Firebase RTDB isolating telemetry when sharing a database instance. |
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
  siteName="तत्व"
  subtitle="जीवन का सार"
  description="संत कबीर, स्वामी विवेकानंद और गौतम बुद्ध के अनमोल विचार — जीवन का सार"
  lang="hi"
>
  <ReelFeed
    quotes={hindiQuotes}
    feedTitle="तत्व"
    feedSubtitle="जीवन का सार"
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

## Local Admin UI

`wiz-theme` includes a lightweight, built-in administrative dashboard to manage your quotes, author profiles, tags, and quality audit metrics directly on your local filesystem without requiring external CMS dependencies.

### Launching the Dashboard

From your project root (where your Astro project is located):

```bash
npx wiz-theme admin
```

Or add a shortcut to your `package.json`:

```json
{
  "scripts": {
    "admin": "wiz-theme admin"
  }
}
```

Then run:

```bash
npm run admin
```

The dashboard will open at **`http://localhost:4242`**.

### CLI Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--port <number>` | Port for the local admin server. | `4242` |
| `--data <path>` | Custom path to the directory containing `quotes/` and `authors/`. | Auto-detected (`src/data`, `playground/src/data`, or `data`) |
| `--consumer <id>` / `--site <id>` | Default consumer identifier for Firebase RTDB audit scoping. | Auto-detected from `package.json` or `'wisdom'` |

Example:

```bash
npx wiz-theme admin --port 5000 --data ./src/data --consumer stoic_hub
```

### Dashboard Capabilities

- 📝 **Quotes Management**:
  - Live full-text search across IDs, quote text, authors, categories, and tags.
  - Multi-dimension sidebar filters (categories, moods, tags, authors, original vs. paraphrase).
  - Multi-column sorting (ID, Author, Category, Mood, Content length).
  - Rich quote editor modal with custom tag editor chips and linked author selector.
  - Bulk actions: multi-select checkboxes, bulk tagging (add/remove tags across selected items), and bulk deletion.
  - Quote duplication for fast variants.
- 👤 **Author Management**:
  - Author roster with live quote counts per author.
  - Edit biographical dossier details (full name, born, died, era, nationality, bio, website, image URL).
  - Automatic slug generation and sync across quote files when an author slug changes.
- 🎨 **4 Built-In Color Themes**:
  - **Midnight Dark** (default sleek dark UI)
  - **Clean Light** (crisp high-contrast daylight theme)
  - **Nordic Slate** (soft oceanic slate)
  - **OLED Black** (pure pitch black `#000000` for OLED displays)
  - Instant theme switching with zero-flash pre-render script and `localStorage` persistence.
- ⌨️ **Keyboard Shortcuts**:
  - `⌘K` / `Ctrl+K`: Instant search focus.
  - `⌘N` / `Ctrl+N`: Create new quote (or new author).
  - `⌘Enter` / `Ctrl+Enter`: Save quote or author modal.
  - `Esc`: Close open modal, dropdown, or confirmation dialog.

---

## Bulk Video Generator CLI

`wiz-theme` includes an automated bulk video generator (`bin/generate.js`) powered by headless Puppeteer. It crawls your running Astro site, navigates through every quote slide, and records 10-second animated 9:16 vertical videos (1080×1920) formatted for Instagram Reels, YouTube Shorts, and TikTok.

### Prerequisites

Install `puppeteer` as a dev dependency in your project:

```bash
npm install -D puppeteer
```

Ensure your local dev server or preview server is running:

```bash
npm run dev
# Running at http://localhost:4321
```

### Running the Video Generator

From your project root:

```bash
npx wiz-theme --url http://localhost:4321 --out ./out-videos
```

Or add a shortcut script in your `package.json`:

```json
{
  "scripts": {
    "generate-videos": "wiz-theme --url http://localhost:4321 --out ./out-videos"
  }
}
```

Then run:

```bash
npm run generate-videos
```

### CLI Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--url <url>` | Target Astro website URL to crawl and render from. | `http://localhost:4321` |
| `--out <path>` | Destination folder where rendered video files will be saved. | `./out-videos` |

### How It Works

1. **Headless 9:16 Viewport**: Launches a headless browser locked to 1080×1920 (vertical reel dimensions).
2. **DOM Crawling**: Discovers all quote slides (`.quote-slide[data-quote-id]`) on the target feed.
3. **Automated Recording Pipeline**:
   - Navigates to each quote via URL hash (`/#q001`) to trigger the ambient shader and typography entrance animations.
   - Automatically opens the quote's **Share Modal**.
   - Triggers the 10-second animated canvas recorder (`MediaRecorder`).
   - Captures and saves the resulting video file directly to your specified output directory using Chrome DevTools Protocol (`CDP`) download interception.
   - Closes the modal and advances to the next quote until the entire catalog is exported.

---

## Firebase Telemetry & Quality Audit

`wiz-theme` includes optional, privacy-respecting client telemetry using **Firebase Realtime Database (RTDB)** to track audience engagement and identify content quality issues.

### Multi-Site Isolation via Top-Level Consumer Identifier

When multiple websites or theme consumers share the **same Firebase instance**, telemetry data is automatically partitioned under a **top-level consumer identifier**:

```text
Firebase RTDB Root
└── {consumerId}/
    ├── quotes/
    │   └── {quoteId}/
    │       ├── views: 1420
    │       ├── likes: 184
    │       ├── dislikes: 3
    │       ├── shares: 29
    │       ├── share_types/
    │       │   ├── image: 18
    │       │   └── link: 11
    │       └── dislike_reasons/
    │           ├── typo: 2
    │           └── wrong_author: 1
    ├── authors/
    │   └── {authorSlug}/
    │       ├── dossierViews: 310
    │       ├── name: "Marcus Aurelius"
    │       └── updatedAt: 1728219400000
    └── dislike_feedback/
        └── {quoteId}/
            └── -Oabc123: { reason: "typo", note: "spelling on line 2", timestamp: 1728219400000 }
```

This guarantees that different websites using the same Firebase database do not collide or overwrite quote views, votes, or user feedback.

### Configuring the Consumer Identifier

You can configure your site's unique consumer identifier in any of the following ways:

#### Option 1: In `astro.config.mjs` (Recommended)

```javascript
import { defineConfig } from 'astro/config';
import { wizTheme } from 'wiz-theme';

export default defineConfig({
  integrations: [
    wizTheme({
      consumerId: 'stoic_hub', // Unique top-level identifier in Firebase RTDB
      siteName: 'Stoic Hub',
    }),
  ],
});
```

#### Option 2: Via Environment Variable (`.env`)

```env
PUBLIC_FIREBASE_CONSUMER_ID=stoic_hub
```

#### Option 3: Via `BaseLayout` Prop

```astro
<BaseLayout consumerId="stoic_hub">
```

> **Fallback Hierarchy**:
> If no identifier is explicitly specified, the theme automatically derives a sanitized slug from `siteName` / `siteTitle` (e.g. `"Philosophy Daily"` → `"philosophy_daily"`), with a final fallback of `"wisdom"`.

### Firebase Environment Variables

To enable Firebase telemetry, add your Firebase credentials to `.env`:

```env
PUBLIC_FIREBASE_DATABASE_URL=https://YOUR_PROJECT-default-rtdb.REGION.firebasedatabase.app
PUBLIC_FIREBASE_API_KEY=AIzaSy...
PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT
PUBLIC_FIREBASE_APP_ID=1:...
PUBLIC_FIREBASE_CONSUMER_ID=my_website_id
```

### Recommended Firebase RTDB Security Rules

To allow public view/like logging and feedback submission while isolating by consumer namespace:

```json
{
  "rules": {
    "$consumerId": {
      "quotes": {
        ".read": true,
        "$quoteId": {
          ".write": true
        }
      },
      "authors": {
        ".read": true,
        "$authorSlug": {
          ".write": true
        }
      },
      "dislike_feedback": {
        ".read": true,
        "$quoteId": {
          ".write": true
        }
      }
    }
  }
}
```

### Auditing Telemetry in the Admin UI

Inside the Local Admin UI (`npx wiz-theme admin`):

1. Click the **`📊 Audit & Analytics`** tab in the top navigation.
2. The dashboard connects to Firebase RTDB and renders:
   - **Total Impressions**, **Total Likes**, **Total Dislikes**, **Total Shares**, **Author Dossiers**, and **Quality Score** (approval rating percentage).
   - **Sub-Tabs**:
     - 🚩 **Flagged & Disliked**: Quotes with negative votes, reason breakdown badges (`typo`, `wrong_author`, `offensive`, `inaccurate`), and reader feedback notes.
     - ❤️ **Most Liked**: Top crowd favorites.
     - 🌟 **Top Shared**: Quotes generating viral image, video, and link shares.
     - 👁️ **Most Viewed**: Highest-traffic reels.
     - 👤 **Author Dossiers**: Profile view leaderboard.
     - 💬 **User Feedback**: Reader corrections and notes.
3. **In-Place Fixes**: Every quote card in the audit tab features an **`✏️ Edit Quote`** button that opens the local quote editor modal, allowing you to instantly fix typos or reassign authors on your local disk.
4. **Consumer Identifier Switcher**: Click the `consumer: [id]` tag in the audit toolbar or click **`⚙️ Settings`** to inspect or switch to any site namespace in real time.

---

## License

MIT © [Ashish Vishwakarma](https://www.ashishvishwakarma.com)
