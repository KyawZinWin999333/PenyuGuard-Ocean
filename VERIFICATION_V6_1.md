# Verification of this improved copy — 29 October 2026

This report applies to the functional improvements in this copy. Earlier bundled verification documents describe the uploaded version and are retained for reference.

## Automated verification

- `npm run check`: JavaScript syntax, 37 passing tests, exact visual-preservation checks.
- `npm run build`: design guard followed by self-contained static build.
- Regression tests cover failed-save rollback, stale-tab writes, corrupt-data preservation and recovery backup, Web Locks invocation, legacy data migration, clarification permissions, private-data filtering, early closure, incomplete handovers, duplicate cycles, locale-independent month order and checksum mismatch detection.
- The fallback SHA-256 implementation matches Node's SHA-256 for empty, Unicode, block-boundary and photograph-sized data.
- `node scripts/verify-export.mjs examples/fictional-public-safe-receipt.json`: verifies the actual JSON downloaded during browser testing.

## Fresh browser observations

- Created PG-2026-0011 through the original reporting wizard; final step showed 100%.
- Requested clarification with separate public question and private rationale. Switched EN/BM while editing: decision selection, question and rationale were retained.
- Public passport displayed the question, hid private rationale/location context, accepted a reporter reply and switched its waiting role to Reviewer.
- Re-review, verification, assignment, task start, documented follow-up and closure completed. The final public timeline contained ten recorded events and survived reload.
- Downloaded safe JSON through the existing button. Its checksum passed the offline verifier. Private reviewer rationale was absent.
- At a 390px iframe width, the reply screen's content and scroll widths both measured 375px (browser scrollbar accounted for): no horizontal overflow.
- An unsent reply in the mobile-width view survived an update to another case in a separate tab.
- Response selection initially jumped to another verified case after assignment; fixed by retaining the explicit case reference. The subsequent response workflow completed on the intended case.

## Limits

The browser checks used a managed Chrome preview, not the user's physical Windows computer. The original .bat launcher was retained; Windows path handling was corrected but needs an actual laptop rehearsal. A browser print dialog/PDF export, assistive-technology audit and production security review were not performed in this pass. This is a local academic simulation with simulated roles and no real authority notifications. Cross-device synchronization and authenticated reporter identity are not implemented. On browsers without Web Locks, compare-before-save checks do not guarantee exclusion of perfectly simultaneous writes.
