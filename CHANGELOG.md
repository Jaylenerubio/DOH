# Changelog

One entry per drop. Newest first. Dates are the day the drop was tagged.

## v1.4.1 Content and translations — 2026-11-12

Content changes (11/10 batch), placeholder translations in six languages, and layout fixes on top of v1.4. Translations are unreviewed until a translator signs off.

- **SNAP:** "None of the above" on the first page routes to the free in-person hand-off (`snap-notfit`); the second page is "Does text-based help work for you?"; new consent text with the Frontdoor Benefits privacy link; hand-off rebuilt as "Free in-person help is nearby".
- **Energy discounts:** new program checklist (SNAP, HEAP, Medicaid, TANF, SNA, SSI, Lifeline, Direct Vendor, federal housing, veterans, other), note under eligible step 1, "Neither" goes straight to not-eligible, explanation sentence on the not-eligible page, utility order Con Edison, National Grid, Both, Neither.
- **Tax credits:** new outcome pages and "Did you claim the EITC?" info page, IRS online account link, one-sentence likely-eligible copy.
- **Tenant support and hospital:** TSU option and review copy; hospital bill copy and dashboard card.
- **Consent and contact:** finish-line sentence removed from consent; period fixes; "Date of birth" label.
- **Wording:** "Back to dashboard" replaces "Return to dashboard" everywhere (hand-off button is primary); "in-person" is hyphenated as an adjective.
- **Profile and errors:** preferred language card, "Number already in use" inline error, Material error icon, Material external-link icon.
- **Translations (placeholder):** Spanish, Arabic, Traditional Chinese, Urdu, French and Polish across the CSS path, all four program flows, tax credits, dashboard and post-language screens. Urdu and Arabic are right-to-left.
- **Layout:** three-option chip rows keep labels on one line and flow as content-width chips; email-code button text shortened; header logo 30px to 44px.
- **Accessibility:** conformance summary updated (axe scan not re-run since v1.4).

## v1.4 Self-service — 2026-11-06

Self-service intake and sign-in return on top of v1.3. Translations (Spanish, Arabic, Traditional Chinese) are being re-added for the new screens; until then the new screens are English only.

- Sign in ("Finish where you left off") asks first name, last name, phone, zip, DOB; email path removed; code step copy: 5 minutes, Resend code.
- Header: language button on the landing page only (language is in My profile); Menu (My profile, Sign out) stays inside the tool.
- Sign in: home CTA "Pick up where you left off" -> Sign in form (first, last, DOB, ZIP, phone; all must match; generic no-match error) -> Enter your code (verify.html) -> Welcome back -> dashboard. Demo record: Ana Lopez, 03/15/1988, 10457, 917-555-2222.
- De-dup now matches on phone alone. "Create an account"/Back return to Contact info with fields cleared; re-entering the same number shows "This number is linked to an account. Use a different number or sign in." under the phone field.
- New accounts go to the dashboard after "Welcome to the HART Connector."
- De-dup page (returning.html) rebuilt from the mock: "Welcome back" with code entry, 0:30 resend, email alternative, "Changed numbers? Email" and "Not you? Create an account".
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


## v1.3 Save & Continue — 2026-10-21

CHW starts in the Blooming Health CRM; the client finishes at home. Self-service intake moves to v1.4.

**Added / changed**
- Translations (placeholder, not reviewed): Spanish, Arabic (right-to-left) and Traditional Chinese for every screen after sign-in; three extra demo clients, one per language (see README). Shared CSS now uses logical properties; sign-in screens stay English.
- Sign-in security demo: code `000000` counts as a wrong code ("Invalid code. You have N attempts left."); the fifth pauses sign-in. Account-not-found screen on desktop: 554px column with equal-width cards.
- `COMPONENTS.md`: component inventory for the React build.
- Landing: single "Resume your session" button.
- Sign-in: email + phone + ZIP + DOB (email required, listed first; the phone/email toggle is gone); code expires in 5 minutes (unconfirmed); "Send a new code" shows a success alert under the code text and starts a 30-second countdown (placeholders); "Verify by email" / "Verify by text" offers a masked on-file email; no-match shows "We couldn't find your account" with the five NYC Health locations and a single Try again button.
- Dashboard: two result states (Referral sent, No match) plus Get started; "Referral sent {full date}" with a program message; "Start your application" returns for Dollar For, Energy discounts and Tax credits; all programs except SNAP shown as "Get started" until completed, results first; support email line at the bottom.
- Handoff pages from the dashboard are static; Back to dashboard on top.
- My profile: "Your information" is read-only; "Preferred contact method" (Text me / Call me) is editable with Edit / Done; a support-email line replaces account deletion ("review, update, or delete your information by contacting us at hartconnectorsupport@health.nyc.gov").

**Removed**
- Health insurance "Prefer a different site?" picker (site changes return later, bundled with editing).
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
