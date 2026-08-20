# v3 polish — readability and mobile density

Date: 2026-08-19

## What changed

- Raised the typography floor across the page. Mobile body copy is 16px, secondary labels are 13px or larger, honest/legal notes are 12px, buttons are 15px, and form controls are 16px.
- Reduced the desktop editorial scale: the 1440px hero title is 61.2px and section titles top out at 50px.
- Kept every walkthrough story and illustrative module, but replaced the long mobile scroll runway with an explicit 01 Hear / 02 Confirm / 03 Print stepper. The controls support click, Left/Right arrows, Home, and End.
- Removed faded story copy. All three desktop steps keep full opacity and contrast; the active marker and changing product canvas carry the progress state.
- Fixed the mobile top-of-page collision by keeping the focused skip link inside the 65px header, removing its travel animation, and preserving a 71px header-to-H1 gap.
- Tightened mobile section padding and reorganized rush context, workflow cards, estimator controls, and pilot fields without deleting copy.
- Kept the beige/deep-purple system, General Tso's Combo narrative, sample/illustrative disclosures, pricing estimator and $30 comparison, FAQ, and pilot form.

## Playwright self-check

Tested against `http://localhost:8000/v3/` with Chromium 1.61.0.

- Desktop viewport: 1440×900. Full-page screenshot: `/tmp/linai-v3-final2-desktop.png`.
- Mobile viewport: 390×844. Final full-page screenshot regenerated after the last type-floor adjustment as `/tmp/linai-v3-final-mobile-verified.png`.
- Mobile document height: 5,825–5,854px across the three step states, down from the reported ~7,786px baseline (24.8% shorter at the tallest state) and within the requested ~5,500px band without removing content.
- Horizontal overflow: desktop 1440/1440 and mobile 390/390 (`scrollWidth/clientWidth`).
- Desktop type: H1 61.2px; H2 50px; walkthrough body 16px; buttons 15px; disclosure/legal copy 12px.
- Mobile type: H1 44px; H2 36px; primary body 16px; secondary labels 13px+; disclosure/legal copy 12px; buttons 15px; form input/select 16px.
- Mobile targets: primary buttons 52px high; step tabs 60px high; menu control 44px high; text inputs/select 48px high; FAQ summaries 53.8px or taller. Range controls remain 16px text with a 36px control box and are not counted as buttons.
- Story state: all desktop story steps and their body copy compute to `opacity: 1`. Each mobile tab exposes the correct preserved story/module at `opacity: 1`; keyboard Arrow/Home/End behavior was exercised.
- Header geometry at 390px: header bottom 65px; H1 top 136.1px; gap 71.1px. Keyboard-focused skip link is at y=10–54 and does not overlap the H1.
- Visible mobile text scan found no rendered text below the 12px legal/disclosure floor.

## Scope

- Changed only `v3/index.html`, `v3/styles.css`, and `v3/script.js`.
- Added this `v3/ITERATION_NOTES.md` record.
- Did not modify `v2/` or the repository-root site.
- No commit was created.
