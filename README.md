# Logs
All things log to a website.

## Discord Log Viewer

There are two versions of the viewer. Pick the one that fits your hosting plan.

### Option 1: Static HTML (best for IONOS / traditional web hosting)

The [website-static/](website-static/) folder is a plain HTML/CSS/JS site with no build step or server-side requirements. You can upload it directly to IONOS, GitHub Pages, Netlify, or any static host.

#### Manual upload

```bash
cd website-static
node scripts/sync-pages.js
```

Then upload the contents of `website-static/` (including the `pages/` folder) to your host.

#### IONOS Deploy Now

This repo is already set up with [IONOS Deploy Now](https://www.ionos.com/hosting/deploy-now) via [.github/workflows/](.github/workflows/):

- [Logs-build.yaml](.github/workflows/Logs-build.yaml) runs `node website-static/scripts/sync-pages.js` before uploading
- It deploys only the `website-static/` folder

Pushes to `main` will trigger the build and deploy automatically.

Files:
- [website-static/index.html](website-static/index.html)
- [website-static/style.css](website-static/style.css)
- [website-static/app.js](website-static/app.js)
- [website-static/logs-data.js](website-static/logs-data.js) — auto-generated list of logs
- [website-static/pages/](website-static/pages/) — copies of the Discord HTML exports

### Option 2: React + Vite

The [website/](website/) folder is a Vite + React version for local development or hosts that support Node.js builds.

```bash
cd website
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

Build for production:

```bash
npm run build
npm run preview
```

The static site is output to `website/dist/`.

### How it works

- The sync script copies the HTML files from `../pages` into the site's `pages/` folder and generates a log list (`manifest.json` for React, `logs-data.js` for static).
- The sidebar lists each log file and shows the channel name + ID extracted from the filename.
- Selecting a log loads it in an iframe so the original Discord styling is preserved.

