# PenyuGuard V6 — English / Bahasa Melayu

V6 builds on Ocean Gallery V5 without replacing the underlying case-management domain.

## Added

- English / Bahasa Melayu dropdown in the **desktop navigation bar**, plus a language option inside the **mobile menu**.
- Language changes immediately and persists in local browser storage (`penyuguard:language`).
- Malay translation across the landing page, image-carousel captions, reporting steps, privacy guidance, case confirmation, Rescue Passport, reviewer workflow, response coordination, insights dashboard, case tracking, printable case summary, demo control room, safety warnings, and interaction feedback.
- Locale-aware dates (`en-MY` / `ms-MY`) and matching document `lang` metadata.
- Translated accessible labels, placeholders and status messages.
- Unit tests for language switching and dynamic status translations, plus a bilingual browser-interaction test.

## Data integrity

The interface language **never modifies internal data keys** such as `entanglement`, `verified`, case IDs, task IDs, zone values, or action identifiers. A critical fix gives the translated location dropdown explicit canonical `value` attributes. New or pre-existing free-text observations remain exactly as written, including the original language; they are evidence, not UI copy. The local public-safe JSON export intentionally preserves canonical keys and data strings.

## Media and compatibility

The original looping 2560×1440 MP4 and all five user-provided gallery images remain untouched. No API key, server translation service, `npm install`, or internet connection is required to switch languages.

## Verification

See `PENYUGUARD_V6_TEST_RESULTS.md`. Actual browser interaction tests use an in-memory Chromium harness; on-device video autoplay and Windows batch execution need local verification.
