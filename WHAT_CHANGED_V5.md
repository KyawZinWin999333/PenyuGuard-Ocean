# PenyuGuard — Ocean Gallery V5

Based on the user's preferred **Final Verified Cinematic V3** website, upgraded without replacing the operational case-management system.

## Changes requested and implemented

- **Original underwater video retained in the landing-page hero only.** It is the exact user-supplied QHD MP4, unchanged and not transcoded. The `video` element has `muted autoplay loop playsinline` and an additional JavaScript ended-event restart safeguard. Video is paused while the browser tab is hidden and resumed when visible, unless reduced-motion is enabled. Browser autoplay restrictions and device capabilities can affect playback.
- **Removed the standalone large video player** that repeated the same footage further down the homepage.
- **Five supplied sea-turtle and coral images now appear in the hero's layered carousel** and in a new five-image editorial photography section directly below the hero.
- The gallery is fully local/offline with accessible links to Report, Track, Insights, Passport and Demo.
- Original uploaded PNGs retained unaltered under `assets/reference-originals/`; carefully optimized JPG display copies saved at original pixel dimensions under `assets/photos/user-turtle-01.jpg` to `-05.jpg`.
- Updated scroll reveals, hover interactions, and responsive grid styles for tablets and small phones.
- No remote image requests are needed for the new gallery. Other already-bundled movie stills remain available across the product.
- Runs on **port 5185** by default so previous PenyuGuard versions still using 5173 won't accidentally be mistaken for this version.

## Preserved core features

Report submission; unique case IDs; optional evidence upload; case tracking; Turtle Rescue Passport; public/internal views; reviewer verification and duplicate warnings; response assignment, follow-up photos, and closure; simulated analytics and two-minute judge demo; browser-local persistence and reset; printable case summary.

## Video and image truthfulness

The film is user-provided marine footage, not incident evidence. Gallery photographs are user-provided visual references: whether they are camera-captured or digitally composed has not been verified. Do not claim particular animals, locations, rescue operations, official partnerships, or copyright clearance.

## Known limits

- Native looping playback was checked in markup and code, and server byte-range response was verified; native playing-through-end-and-loop on the user's Windows PC remains to be checked.
- The browser end-to-end checks are executed in a Chromium in-memory harness because direct localhost navigation is administratively blocked in the test environment.
- All case data is fictional and stored in one browser. The demo role switcher is not production authentication.
