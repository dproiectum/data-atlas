# Data Atlas — Publishing Without Installing Node.js on the Mac

The current priority is local browsing. Cloudflare deployment is deferred.

## Work with the existing repository

Repository: https://github.com/dproiectum/data-atlas. It is public at the user's request and separate from the FinOps project.

Git is already available on the user's Mac:

```bash
git clone https://github.com/dproiectum/data-atlas.git
cd data-atlas
```

Edit Markdown with an existing editor or through GitHub. Building the site can happen remotely; Node.js is not required on the Mac for this workflow.

## Browse locally now

1. Open `index.html` in the complete `Data_Atlas_Local` folder.
2. Select Français or English to change the explanatory content language.
3. Keep all subfolders beside `index.html`.

Navigation, filters and search work offline. External articles need Internet; eBook PDFs stay in OneDrive.

To apply a prepared update, download the latest `Data_Atlas_Update.command` into Downloads, replacing the previous updater, then run:

```bash
bash "$HOME/Downloads/Data_Atlas_Update.command"
```

The updater backs up the existing folder before copying new files. It removes the obsolete generated `LIRE_MOI.txt`; use the English `README.md` instead. This copy does not automatically sync with GitHub or ChatGPT.

## Future Cloudflare Pages configuration

| Setting | Value |
|---|---|
| GitHub repository | `dproiectum/data-atlas` |
| Framework | Astro |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Project root | Repository root |
| Node.js | Version 22, as configured in `.nvmrc` |
| Target domain | `dataatlas.allops.cloud` |

Cloudflare installs dependencies and builds the site in its environment. Review the build logs and published result. GitHub Actions also validates the project and prepares a local artifact.

If future published notes must remain private, configure authentication for both the Pages hostname and the custom domain. A private GitHub repository or a `noindex` tag does not restrict access to deployed pages.

## Future domain and PWA checks

After deployment is authorized, add `dataatlas.allops.cloud` as a custom domain and follow Cloudflare's DNS instructions. Verify HTTPS, intended access, search and navigation. On iPhone, open Safari and choose Share → Add to Home Screen. Test cached pages offline; PDFs are not bundled with the site.

## Update knowledge

Copy a template into `src/content/entries/`, write the content and reference known `DE.XX` or `AI.XX` topics. Review `git diff` and `git status` before committing and pushing. Do not change the original DE Summary or move OneDrive PDFs. Add explicit English translations for new French content.

Without Node.js on the Mac, newly edited Markdown must be compiled remotely before the local copy reflects the changes. GitHub Actions prepares the next compiled export.
