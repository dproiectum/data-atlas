# Data Atlas — Project Status

Updated: 5 November 2026.

| Step | Verified status | Remaining work |
|---|---|---|
| 1. ChatGPT organization | Naming plan documented; sections and folders are available in the user's interface | The user will organize conversations progressively as topics arise |
| 2. GitHub repository | Sources are on `dproiectum/data-atlas`, branch `main`; public visibility was requested by the user | Continue reviewing changes before commits |
| 3. Knowledge mapping | Original 28-domain DE Summary preserved; separate seven-domain AI Engineering Map added | Enrich notes and connect new sources |
| 4. Astro site | Navigation, resource pages, maps and bilingual content built | Visual checks on Safari/Mac remain to be completed |
| 5. Content updates | Markdown templates, mixed DE/AI references and validation available | Add explicit translations when writing new French content |
| 6. Cloudflare | Build configuration prepared: `npm run build` and `dist` | Deployment and DNS changes are deferred at the user's request |
| 7. Mobile PWA | Manifest, icons and service worker prepared | Test after an HTTPS deployment |

## Decisions

- Do not modify the original DE Summary or the physical eBook library.
- Keep the README and operational documentation in English.
- Keep workspace names and main interface controls in English.
- Offer French and English explanations, summaries and note content.
- No Node.js installation is required on the user's Mac to browse the compiled local edition.
- ChatGPT conversations and OneDrive PDFs are not imported automatically.
- No Cloudflare deployment or DNS change has been performed.

## Local edition and updater

The `local-site/` export opens through `index.html` without a local server. It contains relative links and embedded search indexes. A new build is required after source changes.

`Data_Atlas_Update.command` updates `/Users/dtl/Desktop/Data_Atlas_Local` by default. It first backs up the existing folder, then copies the compiled files into place. It removes the obsolete generated `LIRE_MOI.txt`; the English `README.md` is the current local guide. The removed guide remains in the backup.

The updater cannot be applied to the user's Mac from the current execution environment. Running it on the Mac remains a user action.

## Verification

- Four taxonomy tests passed, including mixed DE/AI references and rejection of unknown IDs.
- The DE taxonomy's original Git blob hash is unchanged.
- Both language builds passed: 102 HTML files and 2,270 valid local links.
- Locale-specific search, the same-page language switch, AI topic pages and existing cross-references passed DOM checks.
- The updater was tested against a copy of the previous local edition; backups and custom files were preserved.
- A managed visual preview timed out, so browser layout checks remain unverified.
- GitHub Actions tests, build and artifact generation succeeded for the AI taxonomy commit.

Latest AI feature commit: `4e0f39f2b305b4851dda5194bbfbce32e1a28bc0`.
