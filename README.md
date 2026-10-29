# PenyuGuard — Ocean Gallery V6.1, original design preserved

A cinematic, fictional academic marine-conservation reporting prototype for MMC Upstart 2026. The platform demonstrates how a safe turtle-concern observation becomes a **Turtle Rescue Passport**, undergoes human review, is assigned to a fictional responder, and receives a documented final disposition.


This improved copy preserves the original visual files exactly and adds a clarification loop, case accountability and checkable public-safe exports. Start with `COMPETITION_GUIDE.md`, `IMPROVEMENTS_V6_1.md` and `VERIFICATION_V6_1.md`. Earlier version reports are retained as historical references.

## Quick start on Windows

1. Download `PenyuGuard-Ocean-V6-Improved.zip` and **Extract All**.
2. Open the extracted folder and verify it contains `package.json` and `START_HERE_WINDOWS.bat`.
3. Double-click **`START_HERE_WINDOWS.bat`**.
4. Open **http://127.0.0.1:5186/** in Chrome or Edge. Leave the Command Prompt server open.

Node.js 18+ is required. No `npm install`, external image downloader, or API key is needed. The source video and five new gallery images are bundled locally.

### Command Prompt

Inside the folder containing `package.json`:

```cmd
npm run dev
```

The server listens on port **5186**, distinct from the older PenyuGuard builds on ports 5173 and 5185. If a previous version appears, refresh the 5186 page and close old server windows if needed.

## Visual experience (retained from V5)

The original QHD underwater video loops **only in the landing-page background**. The redundant 30-second full-width video player has been removed. Five uploaded turtle-and-reef images have been added to both the 3D-like hero carousel and a clean five-panel ocean photo essay. All images and footage are available offline. The gallery links lead to real application routes, not dead buttons.

Video autoplay works when the browser permits muted background playback. Native loop and a fallback `ended` handler continuously restart it while visible. A static poster replaces it for reduced-motion settings, load failures, or browsers where video cannot play. Browsers generally pause hidden tabs; the application resumes playback when visible.

See `WHAT_CHANGED_V5.md` and `IMAGE_CREDITS.md` for detailed provenance and implementation notes.

## Language / Bahasa

Use the **EN / BM** selector in the top navigation bar (or within the menu on mobile) to switch between English and Bahasa Melayu. The selection applies to all public and operational screens, form labels, safety instructions, case statuses, dashboards, print summaries and demo instructions. The choice is remembered in this browser and works offline. User-written observations and notes remain in their original language to preserve evidence integrity; public-safe JSON exports use canonical underlying data. See `WHAT_CHANGED_V6.md` and `I18N_GUIDE.md`.

## Features

- 3-step validated reporting wizard, optional private location notes and photo evidence
- Unique case references and public-safe case lookup
- Turtle Rescue Passport and append-only chronological event history
- Reviewer triage, missing evidence suggestions, potential duplicate checks, verification and needs-information handling
- Fictional coordinator assignment, in-progress work, optional follow-up photo, and documented case closure
- Dynamic dashboard counts and charts from the same local case records
- Print / Save as PDF via browser print dialog, with filtered public-safe details
- Operation Safe Turtle guided demo, role switcher, and Reset Demo
- Persisted case records in localStorage; no multi-device synchronization
- Cinematic hero, full photo essay, mobile-responsive gallery and reduced-motion support

## Run tests and static production build

```cmd
npm run check
npm run build
```

`dist/` contains the static site for deploying to a suitable static host. Be sure image/video rights are cleared before publishing. `qa/bilingual_browser_e2e.py` additionally checks Malay workflows. `qa/browser_virtual_e2e.py` runs the browser workflow test in an in-memory Chromium harness where Playwright and Chromium are available; this is not required for Windows use.

## Deploy this folder to Vercel

From PowerShell or Command Prompt in this project folder, run:

```cmd
npx vercel@latest login
npx vercel@latest --prod
```

Sign in to your Vercel account, select your account/team, create a new project named `penyuguard-ocean` (or another available name), and keep the current directory (`./`). The included `vercel.json` selects the Other framework preset, runs `npm run build`, and publishes `dist/`. No environment variables or backend server are required. Vercel prints the live URL after deployment. Run the second command again to publish updates.

The `.vercelignore` file keeps local artifacts out of direct CLI uploads. The original background video is tracked by Git because the build verifies its checksum and this folder does not include the `media-source/` restoration files.

### Deploy through GitHub

Push this folder to a GitHub repository, then open https://vercel.com/new and import that repository. Use these project settings:

- Framework Preset: **Other**
- Root Directory: **./**
- Build Command: **npm run build**
- Output Directory: **dist**
- Environment Variables: **none required**

The build and output settings are also supplied by `vercel.json`. Click **Deploy**. Once the Git integration is connected, pushes to the production branch trigger updated production deployments.

Hosting preserves the current demo behavior: reports stay in each browser's localStorage and are not shared across devices.

## Two-minute demo

Visit **Demo → Load Demo Scenario**, then follow report → generated case → reviewer decision → response assignment → follow-up → closure → updated passport → analytics → print. The included `DEMO_GUIDE.md` gives the full walkthrough.

## Limits and safety

**Academic demonstration prototype; all reports and rescue outcomes are fictional.** Submitting does not contact any actual wildlife service. The demonstration role switcher is not secure authentication, and localStorage is not a production database. Real wild turtles should only be observed from a safe distance; never approach, pursue, disentangle, capture, move, or medically treat them. Contact the appropriate wildlife authority for real emergencies. Do not enter exact turtle nesting locations or personal sensitive details.

The uploaded gallery photos have not been independently license-verified. Keep them for private local demonstrations unless you secure publishing permissions.
