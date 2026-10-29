# PenyuGuard V5 — Test results

## Automated tests (executed)

`npm run check` — **21/21 passed**. Tests cover report validation, case-ID uniqueness, case transitions, review/coordination roles, missing-information and duplicate logic, persistent storage, private-to-public filtering, case history, renders of key pages, five locally bundled gallery images, original QHD video presence, looping video markup, and removal of the duplicate film player.

`npm run build` — **passed**. The `dist/` static deliverable was created.

## Chromium browser interaction harness (executed)

`python qa/browser_virtual_e2e.py` — **32/32 passed**. The browser harness simulated the application's routes and domain state with real clickable interface controls. It exercised: home loading; gallery (five links, images loaded); removal of standalone film; looping-video markup; carousel Next button; demo scenario form; validation; new report submission and reference; new public Passport and filtered location; reviewer start/verify; coordinator task assignment, task start and photo attachment; follow-up and closure; chronological timeline; updated Insights totals; filtered public print; persistence; reset; no uncaught JS errors; and no horizontal overflow at 1440px or 390px.

Actual desktop and mobile screenshots created:
- `preview-desktop-final.png`
- `preview-gallery-desktop.png`
- `preview-mobile-final.png`
- `preview-gallery-mobile.png`

## Server (executed)

HTTP response `200` for the index page from port 5183 while testing with an environment override, and partial-content video response `206` for bytes `0–1023` of the original 68,577,428-byte MP4. All JPEGs are local and included.

## Verified media

Unchanged uploaded QHD film SHA-256 matches the exact original upload. Video inspected via ffprobe: 2560×1440, 30 FPS, 30 seconds. JPEG copies retain source dimensions.

## Not tested in this environment

Actual native MP4 decoding/autoplay-through-end in Windows Chrome/Edge: browser navigation to the local server was blocked by the environment (ERR_BLOCKED_BY_ADMINISTRATOR). The in-memory browser harness stubs video sources, so it does **not** prove real motion playback. Browser Save-as-PDF file generation, Windows batch-launch process behavior, and licensing of user-supplied media also need external confirmation.

Video is configured to loop continuously while this browser tab is visible, subject to browser/device autoplay policies; reduced-motion mode deliberately uses a still frame instead.
