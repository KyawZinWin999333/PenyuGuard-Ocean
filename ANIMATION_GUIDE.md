# PenyuGuard Cinematic V3 — Motion & Interaction Guide

## What changed from Premium V2

This is an in-place upgrade of the working local-data PenyuGuard application. **No reporting, case transition, review, coordination or analytics code was discarded.** The visual system is entirely separated in `js/cinematic.js` and `cinematic.css`.

### 1. Five-scene immersive cinematic hero
The home page opens with original large-scale editorial typography and a perspective stack of five interactive wildlife photo cards. The center card is in focus; nearby cards move in 3D-like layers. Users can click a side photo, use previous/next buttons, select a progress dot, use Left/Right arrows when a carousel item is focused, or swipe horizontally on a touch device. Autoplay moves every 6.5 seconds. Hover, keyboard focus, hidden tabs, Pause and `prefers-reduced-motion` stop autoplay. The Pause button can resume it.

### 2. Storytelling sections
The previous island, conservation process, Turtle Rescue Passport and coordination sections remain, with more refined hover states, intersection-based scroll reveals, and an original three-image photo essay. Scroll reveals use `IntersectionObserver`. Their content stays visible if JavaScript is unavailable and movement is disabled for reduced-motion users.

### 3. Operational pages
Cases, form panels, metrics, evidence records and timeline nodes use restrained entrance reveals. These are presentation enhancements only. They do **not** create demo records, change domain state, determine review outcomes, delay form submissions, or replace existing UI actions.

### 4. Performance and accessibility
- Native CSS transitions and a small, framework-free JavaScript controller. No external JS/CDN dependencies.
- Animations are predominantly transforms and opacity; scroll parallax is requestAnimationFrame-throttled and limited to 18 pixels.
- CSS media queries simplify the stage on 850px and 590px screens.
- Keyboard controls, accessible labels, pause button, focus feedback, and reduced-motion behavior.
- Images have text alternatives and a remote-to-local illustration fallback.

### 5. Image disclaimer
All case history and responder data are fictional. Wildlife/landscape photos are real editorial references, **not proof of real incidents or PenyuGuard rescue activity**. See `IMAGE_CREDITS.md` and the application's footer.

## How to run
Extract the folder and run `START_HERE_WINDOWS.bat` on Windows (or `npm run dev` inside the project directory with Node.js 18+). Open `http://127.0.0.1:5173/`.

To download real original photos for offline use on a connected Windows computer, run `DOWNLOAD_REAL_PHOTOS_WINDOWS.bat`. The website can still display remotely hosted photos when online. If neither path works, the provided original SVG illustrates the unavailable image.

## Limitations
This remains an offline-first, single-browser academic demo. It is **not** a server-side multiuser conservation dispatch platform. Auto-generated locally stored case records and role switches are not secure production authentication. Fully interactive browser verification was blocked in the build environment; critical logic and static render tests were run and results are recorded in `TESTING.md`.


## Ocean Gallery V5

The original QHD film now plays only as the muted, autoplaying looping hero background. A native `loop` attribute plus a JS ended-event restart safeguard are used; browser hidden tabs and reduced-motion users receive appropriate pausing/fallback. The large film-player section has been removed and replaced with a five-image editorial gallery using the user-supplied visuals.
