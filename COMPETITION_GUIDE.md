# PenyuGuard — competition improvements, original visual design

This copy extends the supplied Ocean Gallery V6. The original ZIP remains untouched. The gallery, video, photographs, animation, branding, header, footer, landing-page composition and all three CSS files are preserved exactly. New functionality uses the existing forms and cards.

## A clear competition position

**“A report should not disappear after submission. PenyuGuard makes the next responsible role visible and connects each human decision to a checkable case record.”**

Treat this as the proposed value of this prototype, not a claim that no other conservation platform has similar features. Do not claim partnerships, real rescues, secure identity or first-in-the-world status.

## Demonstrate the improvements

1. Open **Demo → Load Demo Scenario**, complete the existing three-step report and save its generated reference.
2. Switch to **Reviewer**, open the saved case and begin review. Choose **Needs More Information**. Write a private rationale and a separate public-safe question. Record the decision.
3. Open its passport and switch to **Reporter**. Show that the public question is visible while the private rationale and location context are absent. Add a safe fictional clarification.
4. Point to **Waiting on: Reviewer** in the existing Next step card. A reply does not verify a case automatically. Return to the reviewer workspace, resume review and record a reasoned decision.
5. In **Response**, switch to **Coordinator**, assign a fictional team, start its task, record follow-up and close with a documented disposition. The selected case stays active throughout.
6. Open its public passport. Use the existing **Download safe JSON** button. The download now includes recorded-stage checks, the next responsible demo role, waiting age and a SHA-256 checksum.
7. Run `node scripts/verify-export.mjs path-to-downloaded-public-safe.json`. Show a matching checksum. Copy the file, change one case value and verify the copy: the checksum check fails.

A ready-made fictional example is in `examples/fictional-public-safe-receipt.json`. Verify it using `node scripts/verify-export.mjs examples/fictional-public-safe-receipt.json`.

## What the checksum means

It checks file consistency when the original digest is retained. It is not a digital signature or a trusted audit service. Someone able to change both the data and digest can generate a matching file. It does not prove identity, authenticity, notification, a real rescue or ecological impact. Never pitch it as tamper-proof or blockchain.

## Useful questions to answer honestly

- **What is AI doing?** Existing triage and completeness checks are transparent rules. There is no trained injury classifier or medical diagnosis.
- **Who can reply?** Reporter identity and all roles are simulated. Real deployment needs authenticated, case-bound access.
- **Is a long waiting age a rescue emergency?** No. It is an administrative demo indicator, not clinical triage, an escalation alert or a response-time promise.
- **Can two devices collaborate?** No. Records stay in one browser profile and origin. Tabs on that origin update each other. Supporting browsers serialize writes with Web Locks; other browsers have compare-before-save stale-data detection, which cannot guarantee simultaneous-write exclusion.
- **Will it win?** The prototype demonstrates accountability. Stronger evidence would be observed usability sessions, stakeholder feedback and measured completion/error rates; these have not yet been collected.

## Preparation

Use fictional information only. Rehearse the workflow in the same Chrome or Edge browser used for judging. Check browser Print / Save as PDF and the Windows launcher on the actual presentation laptop. Keep the Node server window open, and keep a local copy available in case the venue has no internet.
