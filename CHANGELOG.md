# Changelog

One entry per drop. Newest first. Dates are the day the drop was tagged.

## v1.3 Save & Continue — 2026-10-21

CHW starts in the Blooming Health CRM; the client finishes at home. Self-service intake moves to v1.4.

**Added / changed**
- Landing: single "Resume your session" button.
- Sign-in: email + phone + ZIP + DOB (email required, listed first; the phone/email toggle is gone); code expires in 5 minutes (unconfirmed); "Send a new code" shows a success alert under the code text and starts a 30-second countdown (placeholders); "Verify by email" / "Verify by text" offers a masked on-file email; no-match shows "We couldn't find your account" with the five NYC Health locations and a single Try again button.
- Dashboard: two result states (Referral sent, No match) plus Get started; "Referral sent {full date}" with a program message; "Start your application" returns for Dollar For, Energy discounts and Tax credits; all programs except SNAP shown as "Get started" until completed, results first; in-person support link at the bottom.
- Handoff pages from the dashboard are static; Back to dashboard on top.
- My profile: "Your information" is read-only; "Preferred contact method" (Text me / Call me) is editable with Edit / Done; red "Request account deletion" text button (placeholder, no modal).

**Removed**
- Intake and account creation: language, privacy, contact, contact method, profile created, creating, all set, starting, programs, intake review, returning-client pages.
- In progress, Awaiting response, Submitted states; `?demo=submitted`; applied/submitted tracking; "screen again".

## v2.1 self-service — 2026-10-15 (pre-split baseline)

Full self-service build before the release split. Not sent to vendors. Its flow now lives on branch `v1.4-Self-service`.

**Flow**
- Self-service channel: home → programs → privacy → contact (returning-client check) → contact method → "Your profile has been created" → first chosen program's screener → handoff → dashboard.
- Returning clients: sign in with phone or email + ZIP + date of birth, 6-digit code, "Welcome back" → dashboard. Masked phone/email on verification screens.
- Hospital bills: answering No to the first question goes to "Need to resolve a medical bill?" (Community Health Advocates) and the dashboard shows Not eligible.

**Dashboard**
- Stacked program cards with text status chips (In progress · Screened · Awaiting response · Submitted · Not eligible), a dated status line and action-named CTAs.
- "View details" opens the program's handoff page with a Back to dashboard link; partner-application programs show "Start / Finish your application".

**Header**
- Menu and English open the same full-screen panel; hamburger morphs to an X and the translate icon crossfades on one 0.3s curve; sibling buttons fade in place.
- Language list reads native · English with `lang` and `dir` attributes.
- Desktop (1024px+) shows My profile / Sign out as text links.
- While open: page content is inert, scroll is locked (iOS-safe), Esc/Close/click-away close, focus returns to the button; closes on resize past 1024px and on back-forward-cache restore.

**Pages**
- My profile: one editable card, no record number.
- Not-eligible pages: Back to dashboard on top when opened from the dashboard, no application CTA.
- Health insurance handoff: Important note on both views; phone fields size to content.
- All terminal pages: subtitle grey, body after the divider black; Copy / Copied buttons; label above each contact field.
- "Read more / less" removed; helper text always shown.
- Inline text links are primary blue, underlined. TSU and Dollar For / CSS privacy links are live.

**Accessibility**
- axe-core 4.10.3: 0 violations across 42 page states at phone and desktop widths. See `accessibility-conformance-summary.html`.
- Fixes: progress bars in a labelled region, sign-in Back as a button, combobox wrapper attributes, Welcome-back heading, profile/intake `autocomplete`, helper text tied with `aria-describedby`, new-tab hints on partner buttons.

**Repo**
- `visual elements/` renamed `assets/`. README and this changelog added.
