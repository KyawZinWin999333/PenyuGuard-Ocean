# Language Selector / Pemilih Bahasa

The navbar provides two choices: **EN — English** and **BM — Bahasa Melayu**. The selected language is remembered in the browser so the user can navigate and refresh without having to select it again.

## Coverage

Both languages cover public landing, image gallery, reporting and safety, validation and feedback, case lookup, Rescue Passport and print view, reviewer, coordinator, dashboard, and guided demo. The demo role switcher is independent from the language control.

## Important distinction

Free-text reports, reviewer notes, historical evidence, and values downloaded as JSON are kept as originally entered. They are **not** machine-translated, preserving the original evidence. Fictional seeded sample descriptions have Malay UI-rendering equivalents where applicable. Case IDs, internal status/category keys and stored zones never change across languages.

## Implementation

- `js/i18n.js` holds the offline Bahasa Melayu dictionary and safe UI DOM translator.
- `js/app.js` owns the two selectors, locale-aware dates and locale-triggered re-render.
- `js/cinematic.js` localizes slides that change after page load.
- `localStorage['penyuguard:language']` stores `en` or `ms`. No external service is used.
- HTML `<html lang>` updates to the selected language.

For additional UI text, extend the `ms` dictionary and run `npm test` followed by `python qa/bilingual_browser_e2e.py` (if Playwright/Chromium is available). Do not localize form `value` fields or database keys; translate visible labels instead.
