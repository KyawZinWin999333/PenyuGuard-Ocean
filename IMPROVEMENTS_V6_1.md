# Functional improvements to Ocean Gallery V6

- Complete clarification loop: separate public-safe reviewer question, reporter reply, explicit re-review and human verification. Replies are recorded in the existing timeline. Private rationales are excluded from public and print projections.
- Accountability: the existing Next step card identifies the next responsible demo role and the age of its current waiting period. JSON receipts distinguish recorded verification, assignment and follow-up from early duplicate/unsubstantiated closure.
- Checkable exports: the existing safe-JSON download adds workflow consistency checks and a SHA-256 checksum, with an offline verification script and fictional example. It is a file-consistency mechanism, not a signature or proof of rescue.
- Reliability: failed storage writes leave the in-memory case unchanged; stale snapshots are rejected; supporting browsers use an origin-wide Web Lock for app writes; other tabs receive updates without losing typed action notes. Malformed stored data is retained until an explicit reset, which backs it up.
- Existing V3 local data remains readable. Older needs-information cases receive a generic safe question without publishing their internal notes.
- Bilingual handling: action notes survive language switching. User-written observation text and clarification replies remain in their original language. Review search also accepts translated category/zone names.
- Charts sort numeric year/month keys before applying English or Malay month names, using Malaysia's time zone. Review duration uses the first recorded review decision.
- Duplicate references cannot form cycles; new task references retain the random suffix when secure UUID generation is unavailable.
- Response actions retain the selected case instead of jumping to another verified case after assignment.
- Windows/local server: paths containing spaces and Windows drive paths are decoded correctly; managed preview host/port arguments are supported. The Windows launcher itself is unchanged.
- Final report step displays 100%, correcting the original 99%.

## Design preservation

`npm run check:design` verifies 26 original visual files byte for byte and the original header, footer and landing composition. These include all stylesheets, every supplied image/reference original, the full original QHD MP4, original HTML shell, icons, visual helpers and cinematic animation script. No new stylesheets, image replacements, overlays or redesigned pages were added. Conditional reply/question controls reuse the existing design.

Both supplied V6 ZIPs have SHA-256 `375dd15676d682831ac7ace393d84932de3461755a2fcd0526981bbbb4dfd088` and were left untouched.

The source repository stores the large original QHD video as smaller binary parts to fit source-transfer limits. Build/start reassembles it and verifies the original SHA-256. The downloadable ZIP includes the complete unchanged video, so Windows startup requires no assembly or network.
