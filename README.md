# Logs

All things log to a website.

## Discord Log Viewer

This is a plain HTML/CSS/JS static site — no framework build step, no server-side runtime. It is configured for [IONOS Deploy Now](https://www.ionos.com/hosting/deploy-now).

Because the site is plain HTML/CSS/JS, the deployed files live in the repository root (`./`).

### Project layout

- [index.html](index.html) — viewer shell
- [app.js](app.js) — viewer logic
- [style.css](style.css) — viewer styles
- [logs-data.js](logs-data.js) — auto-generated list of logs
- [pages/](pages/) — Discord HTML exports (kept in the `pages/` directory)
- [scripts/sync-pages.js](scripts/sync-pages.js) — regenerates `logs-data.js` from the `pages/` folder

### Local development

Open [index.html](index.html) directly in a browser, or serve the root folder with any static server.

Regenerate the log index after adding/removing files in `pages/`:

```bash
node scripts/sync-pages.js
```

### IONOS Deploy Now

This repo is set up for IONOS Deploy Now via [.github/workflows/](.github/workflows/):

- [Logs-orchestration.yaml](.github/workflows/Logs-orchestration.yaml) triggers on every push, retrieves project info, and calls build + deploy.
- [Logs-build.yaml](.github/workflows/Logs-build.yaml) runs `node scripts/sync-pages.js` and uploads the repository root (`./`) as the deployment folder.
- [deploy-to-ionos.yaml](.github/workflows/deploy-to-ionos.yaml) is the IONOS-generated deploy workflow.

#### Set up IONOS Deploy Now for this repo

1. **Go to [IONOS Deploy Now](https://www.ionos.com/hosting/deploy-now)** and sign in.
2. **Create a new project from an existing repository** and select `MoklesLoyal/Logs`.
3. Choose **Static Site** as the project type.
4. In the build settings, IONOS will detect the workflows. If asked:
   - **Build command:** `node scripts/sync-pages.js`
   - **Publish / output directory:** `./` (the repository root, because this is plain HTML/CSS/JS)
   - **Node version:** `20`
5. Finish the setup. The IONOS Deploy Now GitHub App will:
   - install the required secrets (`IONOS_API_KEY`, `IONOS_SSH_KEY`, etc.)
   - rewrite `project-id` in both [Logs-orchestration.yaml](.github/workflows/Logs-orchestration.yaml) and [Logs-build.yaml](.github/workflows/Logs-build.yaml) to match your new project
   - ensure the orchestration workflow is wired to the correct project
6. **Push your code to `main`** (or any commit). The orchestration workflow will run and deploy the site.

> **Note:** [Logs-orchestration.yaml](.github/workflows/Logs-orchestration.yaml) and [Logs-build.yaml](.github/workflows/Logs-build.yaml) currently contain `project-id: YOUR_IONOS_PROJECT_ID`. Leave them as-is if you connect through the IONOS GitHub App — they will be rewritten automatically. Only replace them manually if you are configuring the project by hand and already know your project ID from the IONOS dashboard.

### How it works

- The sync script scans the `pages/` folder and generates `logs-data.js` so the viewer can list logs without server-side directory listing.
- The sidebar lists each log file and shows the channel name + ID extracted from the filename.
- Selecting a log loads it in an iframe so the original Discord styling is preserved.

