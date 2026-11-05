# Changelog

One entry per drop. Newest first. Dates are the day the drop was tagged.

## Unreleased (v1.4-Self-service) — 2026-11-04

- Sign in ("Finish where you left off") asks first name, last name, phone, zip, DOB; email path removed; code step copy: 5 minutes, Resend code.
- Header actions (language, menu, My profile, Sign out) show on the landing page only.
- My profile: Preferred language card (editable, `nyc.language`); added missing profile list styles.

**Flow**
- Self-service: contact → **Check your information** (new `review-info.html`, editable) → verify by text code → profile created. Contact-method page is CHW-only.
- Progress shows 2/4, 3/4, 4/4 for self-service.
- Profile: "Your information" card is read-only (no Edit); only preferred contact method is editable.
- Self-service: "I'm looking for support" (programs) page removed from the flow. New **Preferred language** page (`preferred-language.html`) comes first; a language picked with the header Translate control is carried over. Dashboard now shows all programs as featured rows until one is started.
- Verify: OTP 6 digits, 5-min expiry, max 5 wrong attempts then 1-hour lockout (`locked.html`, live m:ss countdown), 30s resend wait ("Resend in 0:30"), expired code allows immediate resend, masked phone (last four) and email (first letter + domain) shown semibold. Demo: code 000000 is always wrong; a phone ending 0000 fails to send. Lock is session-only in the prototype.
- **SNAP (food stamps)** via Frontdoor Benefits, self-service only: `snap` (what do you need help with) → `snap-fit` (does text and online help work) → `snap-review` (review and submit) → `snap-next` (apply / enroll / renew steps + "Need food now?"). "No" on the fit question goes to `snap-notfit` (free in-person help, food, WIC, CSFP). New dashboard card with a "Not a fit" state. External links are placeholders (`data-placeholder`, href "#") until URLs are confirmed.
- **Dashboard content update:** all six programs are cards (Hospital bill forgiveness, Health insurance, Energy discounts, Tax credits, Tenant support, SNAP (food stamps)); "Other featured programs" rows removed. Each card is no chip, **Referral sent** ("We shared your info on <date>…"), or **No match** with its own copy and View details. Tax credits has no chip when eligible; Health insurance never shows No match (OHIS takes every referral). Hospital bills shows a demo PIN. Tenant support reaching the 311 page now reads No match. "Need help? Email" line added.
- Self-service: email is optional at intake (contact and check-your-information pages show "Email (optional)" with grey text); the CHW channel still requires it. Welcome page after verification breaks as "Welcome to the / HART Connector."
- Combobox: restoring a saved choice no longer opens the list; picking an option no longer reopens it filtered to that one option, so the language can be changed (preferred-language and CHW language pages).
- `review-edit.js` skips `.review-card[data-readonly]`.

## v2.1 self-service — 2026-10-15

Baseline for the vendor hand-off.

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
