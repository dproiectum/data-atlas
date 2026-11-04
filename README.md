# Data Atlas

A personal knowledge library connecting **Tech Watch**, **Job Seeking** and **Learning Lab**.

The 28-domain **DE Summary** is the reference taxonomy. Original eBooks stay in their existing OneDrive folders; Data Atlas stores notes, source references, tags and relationships.

## Local use without installation

Open `index.html` in the exported local folder. Keep all subfolders beside it. No Node.js installation or local server is required to browse this edition.

Choose **Français** or **English** in the header. Workspace names and main controls stay in English. Explanations, summaries and the five initial notes are available in French and English. Language links keep you on the same page and preserve the chosen language throughout navigation. The hosted site also remembers your preference when browser storage is available.

Search, filters and navigation work offline. External articles require Internet; original PDFs are not bundled. The local edition is a compiled snapshot, so editing source Markdown requires a new export.

## Build

In a Node.js build environment (Node 22 is configured):

```bash
npm ci
npm run build:local
```

The complete local edition is generated in `local-site/`. The regular web build is in `dist/`:

```bash
npm run build
npm run dev      # optional source preview; bilingual editions are generated during build
```

GitHub Actions builds both languages and exports the `Data_Atlas_Local` artifact. Cloudflare Pages deployment is deferred; the intended domain is `dataatlas.allops.cloud`.

## Content and translations

- `src/content/entries/`: canonical Markdown entries.
- `src/content.config.ts`: content schema.
- `src/data/de-summary.json`: unchanged taxonomy index, including stable `DE.XX` identifiers.
- `src/i18n/interface-en.json`: English workspace and control labels shared by both editions.
- `src/i18n/content-en.json`: reviewed English translations of French explanatory text.
- `src/i18n/content-rich-en.json`: translations that preserve inline emphasis.
- `templates/`: starting points for articles, eBooks and market reports.
- `scripts/build-languages.mjs`: creates the two compiled editions and language-specific search indexes.
- `scripts/export-local.mjs`: makes all links and searches work directly from local files.

To add content, copy a template into `src/content/entries/`, fill in its metadata and write the note. Keep the filename stable when updating it. Link entries using `primaryTopic`, `relatedTopics` and `relatedEntries`.

Add English translations for new explanatory text in `src/i18n/content-en.json`. Translation is explicit: text without a translation remains in its original language. Technical names and the original DE Summary are preserved. Generated pages and search indexes are rebuilt automatically; intellectual summaries still need to be written and checked.

## Validation

```bash
npm run validate
npm run build:local
```

Validation checks the five initial notes, their topic references and links. The build generates French and English pages, then Pagefind indexes both languages. The local edition embeds each language’s search data to avoid browser restrictions on fetching local files.

## Boundaries

- No eBook PDF is moved, renamed or published.
- No automatic import of conversations, Medium articles or job postings is configured.
- The local edition is read-only; edit the source Markdown to update knowledge.
- The PWA requires HTTPS and is separate from direct local-file browsing.
- A public GitHub repository or `noindex` does not provide access protection for personal notes.

## Update an existing Mac folder

After building the local edition, run `npm run export:update` in the build environment. It generates `Data_Atlas_Update.command`, a self-contained updater. Running it on the Mac updates `/Users/dtl/Desktop/Data_Atlas_Local` by default, backs up the existing folder beside it and opens the homepage. It makes no network requests and does not need Node.js on the Mac. An optional first argument selects a different existing local-edition folder.
