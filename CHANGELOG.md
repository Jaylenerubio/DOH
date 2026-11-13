# Changelog

One entry per drop. Newest first. Dates are the day the drop was tagged.

## Unreleased — landing page

Not part of the v1.4.1 tag.

- **Validation on phones:** a failed Continue now scrolls the first control that needs an answer (for example the "I agree" checkbox on the consent page) into view above the pinned bar, with its "Required" message, instead of leaving it off screen (`A11y.queueErrorScroll`).
- **Hospital bills:** Continue without an answer shows "Select an answer to continue" under the Yes / No cards (it was just above them) and the page scrolls so the cards and the message are both in view above the pinned bar. A small change; the page already scrolled to the message.
- **Language picker on phones:** the list opens under the field in the page, not over it, and the field scrolls up to stay in sight when the keyboard opens. It follows the keyboard opening and closing. The City field on the contact page still uses the floating list (`inline` option in `scripts/combobox.js`).
- **Phones:** the Back / Continue bar (and the hand-off pages' action buttons) now stays pinned to the bottom of the visible screen under 768px, above the browser's own bottom toolbar, instead of sitting at the end of a long page where the toolbar could cover it. It is sticky, so it never hides the last lines of content. Tablet and desktop are unchanged. Tested at 320, 375 and 820px across 16 pages; not yet checked on a real iPhone.
- **Hand-offs:** where there were two stacked buttons (the partner action plus "Back to dashboard"), "Back to dashboard" now sits top left above the title, the same arrow link the dashboard's detail view uses, so the pinned footer is one button on every hand-off page (Hospital bills, Energy discounts, Tax credits). Pages that only had "Back to dashboard" keep it as the footer button.
- README rewritten for the vendor handoff: start-here list, how the landing page and the tool fit together, the six programs (SNAP added), the current flow and the translation setup. Removed `scripts/landing.js`, the old landing page's rotating hero word, which nothing used.
- Translated pages no longer flash English before switching language or direction: `scripts/i18n-gate.js` (in the head of the 39 translated pages) hides the page until `i18n-dom.js` has applied the translation and the language's font has loaded, with a 2.5-second failsafe. English pages are unaffected.
- Every page, tool and landing, has the NYC favicon (`assets/logo/`) and link-preview tags (`assets/social/share.png`). `og:image` is an absolute address on `hart-connector-v2.vercel.app`; change it when the production domain is known. The share image is a placeholder.
- Removed the stray `undefined/` folder. The landing footer's Privacy policy link stays unwired until a policy page exists.
- `home.html` and `index.html` redirect to the new HART landing page in `landing/` (11 languages; its buttons open `preferred-language.html` and `signin.html`; the language picked carries into the tool). The tool uses the landing page's SVG logo (`assets/nyc-health-stacked.svg` replaces the PNG). `preferred-language.html` notes that Russian, Bengali, Haitian Creole and Korean are not translated in the tool. Landing translations are unreviewed; Russian, Bengali, Haitian Creole and Korean are machine drafts.

## v1.4.1 Content and translations — 2026-11-13

Content changes (11/10 batch), placeholder translations in six languages, and layout fixes on top of v1.4. Translations are unreviewed until a translator signs off.

- **Copy round (11/13):** profile support line now emails hartconnectorsupport@health.nyc.gov; Dollar For: "Tell us about your bill", new later-link note, step 3 "Most hospitals decide within 30 days.", sharing line removed; EITC likely/maybe pages rewritten; durations use numerals (3 years, 3 business days); SNAP "Need food now?" box is link only; SNAP apply/enroll step copy. Translations unreviewed.
- **Energy discounts (11/13):** the EAP "Start your application" link goes to the BEA staging start link (`https://staging.nyc-bea.navateam.com/start`; the vendor swaps in the production link at launch); step 3 reads "Once approved, you'll receive the EAP discount within two billing cycles."; the utility chips fill the row at equal widths from 600px up.
- **Hospital bills (11/13):** step 1 of the Dollar For hand-off says "You'll need proof of income, like:".
- **Tenant support (11/13):** the review and submitted-view label matches the screener question, "Are any of the following situations happening to you?".
- **Tax credits (11/13):** the likely-eligible page is two steps like the maybe page, with the GetYourRefund line above the steps.
- **Profile (11/13):** support line reads "Email hartconnectorsupport@health.nyc.gov to update or delete your profile."
- **Back button:** walking back from a hand-off or result page into the screener now clears that program, so the dashboard shows "Get started" instead of "Referral sent" (`scripts/flow-reset.js`).
- **SNAP:** "None of the above" on the first page routes to the free in-person hand-off (`snap-notfit`); the second page is "Does text-based help work for you?"; new consent text with the Frontdoor Benefits privacy link; hand-off rebuilt as "Free in-person help is nearby".
- **Energy discounts:** new program checklist (SNAP, HEAP, Medicaid, TANF, SNA, SSI, Lifeline, Direct Vendor, federal housing, veterans, other), note under eligible step 1, "Neither" goes straight to not-eligible, explanation sentence on the not-eligible page, utility order Con Edison, National Grid, Both, Neither.
- **Tax credits:** new outcome pages and "Did you claim the EITC?" info page, IRS online account link, one-sentence likely-eligible copy.
- **Tenant support and hospital:** TSU option and review copy; hospital bill copy and dashboard card.
- **Consent and contact:** finish-line sentence removed from consent; period fixes; "Date of birth" label.
- **Wording:** "Back to dashboard" replaces "Return to dashboard" everywhere (hand-off button is primary); "in-person" is hyphenated as an adjective.
- **Profile and errors:** preferred language card, "Number already in use" inline error, Material error icon, Material external-link icon.
- **Translations (placeholder):** Spanish, Arabic, Traditional Chinese, Urdu, French and Polish across the CSS path, all four program flows, tax credits, dashboard and post-language screens. Urdu and Arabic are right-to-left.
- **Hand-offs and headings:** the "Your NYC Health enrollment site" screen is removed (health insurance goes from Review and submit straight to the counselor hand-off; the site is still matched by ZIP). Review and submit no longer says "we'll share your information" for tax credits (GetYourRefund) or for EEAP (cold hand-offs); the EAP programs route keeps it. H1s have no ending period unless they are questions. On the tax-credit hand-offs (likely, maybe and already-claimed), "File now" is now a link to GetYourRefund with the external-link arrow.
- **Layout:** short-label chip rows (Yes / No, Morning / Evening / Anytime) keep labels on one line and fill the row at equal widths on every screen size; long-label options are full-width stacked cards; email-code button text shortened; header logo 30px to 44px.
- **Accessibility:** conformance summary updated (axe scan not re-run since v1.4).

### v1.4.1 QA guide (self-service channel)

Start from the home page, choose "Create an account", pick a language, finish contact, review and the code. Each case below starts on the dashboard card named in bold. Reset by closing the tab (state is `sessionStorage`).

**OTP errors** (`verify.html`; the code is any six digits except `000000`)
- Wrong code: enter `000000`. The inline error appears. The fifth wrong try goes to `locked.html` (1-hour lock with a live countdown; the lock is session-only in the prototype).
- Code didn't send: use a phone number ending `0000` and the text option. "Code didn't send. Check your number or try again." shows and Resend is available.
- Code expired: wait 5 minutes on the page, then enter any code. "Code expired." shows and Resend is available at once.
- Resend: after any send, Resend shows "Resend in 0:30" and becomes active at 0:00.
- Existing account: enter phone 917-555-2222 on Contact. It opens the "Welcome back" code screen. Signing in uses Ana Lopez, 03/15/1988, 10457, 917-555-2222.

**CSS path (Community Service Society)** — hospital bills only
- On the language screen choose Urdu, Arabic, French or Polish. Open **Hospital bill forgiveness**, answer "Yes" to "Do you have an unaffordable hospital bill?", finish the bill questions, and submit from the review page.
- You land on `df-css.html` (a CSS health counselor) with no "Start your application" button. English, Spanish and Chinese land on `df-next.html` (Dollar For) instead.
- The dashboard hospital card title and copy also change on this path (a CSS health counselor will call within 2 business days).

**Back button**
- Finish any program to its hand-off, press Back through the screener, then open the dashboard. The card reads "Get started", not "Referral sent".

**How to get an ineligible ("No match") screen**
- **Hospital bill forgiveness:** answer "No" to the hospital bill question (`df-ineligible.html`).
- **Energy discounts:** either choose "Neither" for the utility (`eap-ineligible.html`), or choose a utility, answer "No" to government assistance (or choose Yes with only "Other/not listed"), enter a household size, and answer "No" to "Do you make less than $…?" (limit is $113,400 for 1 person; it rises by household size).
- **Tax credits:** answer "No, I missed at least one year" (or "I'm not sure") to filing, "No" to work income, and "No, I do not have children" (`eitc-ineligible.html`). "Not sure" on income counts as having income.
- **Tenant support:** pick "None of the above. (I have a different housing issue.)" and Continue (`tsu-311.html`).
- The dashboard card then reads "No match" with its own copy and "View details".

**How to get the "Not a fit" screen (SNAP)** (`snap-notfit.html`, "Free in-person help is nearby")
- On the first SNAP page choose "None of the above" and Continue, or
- choose any of the three options, then answer "No" to "Does text-based help work for you?".
- The dashboard SNAP card then shows "Not a fit". Choosing "Yes" goes to Review and Submit instead.

**Also worth a pass**
- Chip rows at 320, 390 and 768px in every language (health insurance, tax credits, energy discounts): one-line labels, no sideways scroll.
- "Back to dashboard" is the only primary button on every hand-off and ineligible screen.
- Right-to-left layout in Arabic and Urdu, including the header logo and buttons.
- Placeholder translations are unreviewed; note awkward strings for the translator.

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
