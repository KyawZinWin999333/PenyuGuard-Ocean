# PenyuGuard Ocean Gallery V5 — Verification and change report

## Scope

This update is based on the supplied and previously validated **PenyuGuard Final Verified Cinematic V3** project, not an independent comparison of two new ZIP files. This pass implements the user's latest visual changes while preserving existing case-management behavior.

## Design changes

1. Original user-supplied QHD underwater film retained and looping as the landing hero background.
2. Duplicate second large video player removed from the home page.
3. Five newly supplied turtle and coral images added to the animated layered hero carousel.
4. Full editorial five-image gallery added below the hero; each image links to a real app page.
5. Original uploaded PNGs stored unmodified; local JPEG display copies preserve pixel dimensions and have consistent grading.
6. Responsive styles added for desktop, tablet, and 390px mobile; readable text overlays and reduced-motion support preserved.

## Workflow continuity

The existing shared domain data model and app route handlers were not reimplemented or replaced. Browser-interaction tests exercised submission, generated Passport, human verification, coordinator assignment, follow-up photo, documented closure, metrics, privacy and demo reset. All passed in the harness. No public nesting coordinates or real-world dispatch were introduced.

## Evidence

- `npm run check`: 21/21 passing automated tests.
- `python qa/browser_virtual_e2e.py`: 32/32 browser-harness checks.
- `npm run build`: successful, static output created.
- Actual video SHA-256 identical to user upload. MP4 byte-range server response returned HTTP 206.
- Desktop and mobile screenshot captures visually checked.

## Risks and limitations

- Actual native media loop performance on the user's Windows machine needs confirmation. Browser restrictions may pause video in background tabs or on reduced-motion settings; a static fallback is present.
- The browser test harness used in-memory loading because direct localhost navigation is blocked. Real network media playback and Windows batch launching have not been visually verified.
- `Print / Save as PDF` uses the browser's print dialog, not a native-generated PDF.
- User-provided imagery and video have not been independently cleared for public redistribution.
- Client-side roles and localStorage are demo-only and do not provide server security.

## Verdict

The **visual update and original core workflow pass the available automated and harness-based checks**. The build is suitable for local user acceptance testing. Confirm looping video playback, Windows launching, print output, and rights clearance before a public showcase.

---

## V6 language extension (29 October 2026)

The preceding report describes the historical V5 audit. In **V6**, the English/Bahasa Melayu navigation switcher is implemented across the page routes and all critical case workflows. Translated visible labels are separated from canonical database values, and original free-text evidence remains unchanged. Additional V6 tests passed (25 automated and 58 browser-harness checks). Refer to `PENYUGUARD_V6_TEST_RESULTS.md` for the current results.
