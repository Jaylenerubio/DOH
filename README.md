# NYC HART Connector — prototype

Static HTML/CSS/JS prototype of the NYC Health HART Connector: a screening tool that checks whether a New Yorker may qualify for six programs and hands them to the right application or referral. This repository is the design specification for the production build. The pages, copy, states and interactions are the reference; the code is not meant to be reused as-is. Where this repository, the landing page package, Figma or any other document disagree, **the prototype wins**.

**Live prototype:** https://hart-connector-v2.vercel.app/home

## Start here

1. This README, then `CHANGELOG.md` (what each release changed, and the QA guide with the test cases).
2. `accessibility-conformance-summary.html` (WCAG 2.2 AA notes, scan results, known gaps) and `COMPONENTS.md` (component inventory).
3. Run it: there is no build step and no dependencies. Serve the folder (`npx serve .`) and open `/`. Opening files directly (`file://`) does not work for the landing page.
4. "Placeholders the production build must replace" (below) lists every stand-in value.

## Two deliverables, one set of rules

The HART Connector is delivered as two parts:

| Part | Delivered as | How to implement |
|---|---|---|
| Landing page | `HART landing page.zip` (its own folder, build and handoff documents) | Port it exactly. Follow its README and `landing-dev-handoff.html`; use the generated React component as is. |
| Tool (this repository) | This repository and the live prototype | Reference specification. Rebuild the pages, copy, states and interactions in your own stack. |

- `landing/` in this repository is a **preview copy** so the two parts connect on the live link. Deploy the landing page from the zip, not from this folder.
- The landing buttons open `preferred-language.html` ("Get started", header button) and `signin.html` ("Pick up where you left off").
- The landing language picker passes `?lang=<code>`; the tool stores it and removes it from the URL (see "Landing page" below). Keep this behavior.
- Both parts share the logo, favicon and link-preview image (`assets/logo/`, `assets/social/share.png`). The share image is a placeholder, and `og:image` is an absolute address on `hart-connector-v2.vercel.app` on all 55 pages: change it when the production domain is known.
- Eleven languages are listed: English, Spanish, Chinese (Traditional), Russian, Bengali, Haitian Creole, Korean, Arabic, Urdu, French, Polish. The landing page has all eleven (machine drafts); the tool translates six (all but Russian, Bengali, Haitian Creole, Korean), also unreviewed. Arabic and Urdu read right to left.
- **Security:** the strict content security policy in the landing handoff (section 06) applies to the landing page. The tool stores answers in `sessionStorage` and loads Google Fonts, so it needs its own policy, set by the build team and the City's security review.

## The flow

A HART employee (CHW) can start the client's record in the Blooming Health CRM; the client then finishes at home. The self-service path (channel `self`) is in this repository.

```
landing → preferred-language → privacy → contact → review-info (check and edit details) → verify (text code) → profile-created → dashboard
returning: signin (or returning, if contact details match) → verify (code) → welcome-back → dashboard
dashboard → program screener → review → handoff (or not-eligible page) → dashboard · "View details" (static handoff page) · "Start your application" (partner link) · My profile
```

- Sign-in finds the record by email + phone + ZIP + DOB (all four must match; email is required at intake). No match shows "We couldn't find your account", the five NYC Health locations and a single "Try again" button.
- "Verify by email" / "Verify by text" on the code step offers a masked email, only if an email is on file (phone first). Users never type an email.
- Sets `nyc.channel = 'self'`.

## Programs

| Key | Name | Screener | Handoff (eligible) | Not eligible |
|---|---|---|---|---|
| `hospital-bills` | Hospital bills (Dollar For) | `dollarfor` → `df-bill` → `df-self` → `df-review` | `df-next` | `df-ineligible` |
| `medicaid` | Health insurance | `hi` → `hi-review` | `hi-next` | — |
| `anti-eviction` | Eviction (Tenant Support Unit) | `tsu` → `tsu-review` | `tsu-connected` | `tsu-311` |
| `financial-help` | Energy discounts (EAP / EEAP) | `eap` → `eap-review` | `eeap-next` | `eap-ineligible` |
| `tax-credits` | Tax credits (EITC) | `eitc` → `eitc-review` | `eitc-eligible` (also `eitc-maybe`, `eitc-claimed`) | `eitc-ineligible` |
| `snap` | SNAP (food stamps) | `snap` → `snap-fit` → `snap-review` | `snap-next` | `snap-notfit` (free in-person help) |

Program labels, descriptions, entry pages and partner application URLs live in `scripts/pillars.js` (`ORDER`, `META`, `APPLY`); the dashboard's display order is in `scripts/dashboard.js`.

## Where things live

| Path | What |
|---|---|
| `styles/tokens.css` | Design tokens — colors, type scale, spacing, radii. Change here first. |
| `styles/components.css` | Shared components: buttons, chips, cards, header/nav panels, copy fields, handoff steps. |
| `styles/<page>.css` | Page-specific layout only. |
| `scripts/pillars.js` | Program config, completion/outcome state, handoff wiring. |
| `scripts/dashboard.js` | Dashboard card states and CTAs. |
| `scripts/handoff-view.js` | Handoff pages when opened from the dashboard (`?from=dashboard`). |
| `scripts/banner.js` | Self-service header: Menu / language panels, desktop links, sign-out. |
| `scripts/language.js` | Preferred-language page: stores the choice, reads the landing page's `?lang=`, shows the note for languages the tool lacks. |
| `scripts/i18n.js`, `scripts/i18n-dom.js`, `scripts/i18n-strings.js`, `scripts/i18n-gate.js` | Prototype translations (see "Translations" below). |
| `scripts/mask.js` | Masked phone/email and the demo returning-client match. |
| `scripts/a11y.js` | Live region, step errors, focus helpers. |
| `landing/` | HART landing page, one page per language (`landing/es/`, …). Generated from the separate landing-page package (NYCO component library); edit that package and rebuild, not these files. `home.html` and `index.html` redirect here. |
| `assets/` | Logo (SVG), icons, illustrations. |
| `CHANGELOG.md`, `COMPONENTS.md` | Release history with QA guide; component inventory. |
| `accessibility-conformance-summary.html` | WCAG 2.2 AA conformance notes, automated-scan results, known gaps. |

Runtime copy (dashboard status sentences, language list) is in the scripts above; everything else is in the HTML.

### Landing page

- The build output is copied to `landing/` with a `<base href="/landing/…">` tag added to each page, so relative asset URLs survive Vercel's no-trailing-slash redirect. The site must be served from the domain root; under a sub-path, change the `<base>` tags.
- Buttons link into the tool: "Get started" and the nav button go to `preferred-language.html`; "Pick up where you left off" goes to `signin.html`; the footer's Privacy policy link is unwired (`data-unwired`, goes nowhere) until the policy page exists.
- The landing language picker passes `?lang=<code>`. `scripts/language.js` stores it in `sessionStorage` (`nyc.language`) and removes it from the URL. Russian, Bengali, Haitian Creole and Korean are on the landing page but not translated in the tool, so `preferred-language.html` shows a note naming the six languages that are.
- The landing page has a footer; the tool pages do not. Open item for DOHMH and design.
- The landing source package and its font files are not in this repository. The conformance summary and `COMPONENTS.md` do not cover the landing page.

## State

Everything is `sessionStorage`; nothing is sent anywhere. Clearing the tab resets the prototype.

| Key | Holds |
|---|---|
| `nyc.channel` | `'self'` or unset (CHW) |
| `nyc.contact` | `{ firstName, lastName, dob, zip, phone, email }` |
| `nyc.contactMethod` | `'text'` / `'call'` / `'email'` |
| `nyc.recordId` | set at sign-in (demo record) |
| `nyc.programs` | programs with a result, seeded at sign-in |
| `nyc.completed`, `nyc.completed.<key>` | screened programs, and when |
| `nyc.outcome.<key>` | `'eligible'` / `'ineligible'` (a completed program with no outcome counts as eligible) |
| `nyc.returning` | `'verified'` |
| `nyc.language` | chosen language code (Spanish, Arabic, Chinese, Urdu, French and Polish translate the pages after it; the rest show English) |
| `nyc.df`, `nyc.hi`, `nyc.tsu`, `nyc.eap`, `nyc.eitc` | per-program answers |

Demo client: email `ana@example.com`, phone `917-555-2222`, ZIP `10457`, DOB `03/15/1988` (anything else shows "We couldn't find your account"). Any 6 digits verify, except `000000`, which counts as a wrong code ("Invalid code. You have N attempts left."); the fifth pauses sign-in. The demo record seeds no results: every program shows "Get started" until a screener and handoff are completed. In production the vendor fills these from what the client did with the CHW in person. All names, numbers and sites are fictional.

## Translations

Placeholder translations, not reviewed by a translator. The language is chosen on `preferred-language.html` (also in the header language menu, on `review-info.html` and in My profile). Every page after `preferred-language` renders in it; `preferred-language` and `signin` stay English. Languages without translations show English, and the preferred-language page says which six are translated.

How it works: `scripts/i18n-strings.js` holds every string (English text to each language); `scripts/i18n.js` and `scripts/i18n-dom.js` swap them in at load and when scripts add text later; `nyc.language` picks the language; `<html lang>` and `dir` follow it (Arabic and Urdu are right to left, with mirrored layout and icons and left-to-right numbers, emails and addresses). `scripts/i18n-gate.js` keeps a translated page hidden until its text is swapped in, so there is no flash of English (prototype only). Production should replace all of this with real localization (message keys and locale files). Proper names (hospitals, cities, partner and utility names) are not translated.

## Dashboard states

Programs with a result come first, then the rest, under the two-tone "Explore programs & applications for you" H1 (small "Hi, {name}" above it). The support email line (envelope + mailto link) sits at the bottom. Clicking a partner link does not change state.

| State | Chip | Body | CTAs |
|---|---|---|---|
| Not started | none | Program description | Get started |
| Eligible | Referral sent | "Referral sent {Month d, yyyy}. {program message}" | Start your application (Hospital bills, Energy discounts, Tax credits only) + View details |
| Not eligible | No match | Program description | View details |

## Placeholders the production build must replace

- Dollar For PIN shown as `####` in the Hospital bills dashboard message.
- Code expiry ("5 minutes"), the 30-second resend countdown and the "We sent you a new code." alert copy are placeholders.
- Not-found screen: confirm HART employees are at all five locations (two are Sexual Health Clinics, both linking to the generic clinics page) and walk-in vs appointment.
- Support contact is the email hartconnectorsupport@health.nyc.gov (dashboard, My profile, and the paused-sign-in screen once built). Account deletion is a request by email; what BH does with it (records are never hard-deleted) is TBD.
- Health insurance: the "Prefer a different site?" picker is removed for v1.3; site changes return later, bundled with editing client information.
- OTP rules are proposals pending security (not built in the prototype): 6-digit single-use code, expires in 5 minutes; 5 wrong codes per code, with a warning at 2 left, then sign-in pauses 15 minutes; 30-second resend cooldown, at most 3 new codes per 15 minutes; 5 failed detail lookups per 15 minutes per device, then a 15-minute pause (lock the device, not the account). The server enforces limits; the screen only displays them. Wrong-code message (placeholder): "Invalid code. You have 2 attempts left."
- Energy discounts: Benefits Enrollment Assistant link: currently the BEA staging start URL (`https://staging.nyc-bea.navateam.com/start`) in `scripts/pillars.js` and `eeap-next.html`; swap for the production URL at launch.
- Hospital bills: `https://dollarfor.org/` stands in for the simplified-application link.
- Enrollment-site names, addresses, hours and phone numbers (`scripts/hi-sites.js`).
- "Connect with a HART employee" link on No match cards: TBD, left out.
- Program names and descriptions: pending JL content review.
- Translations (Spanish, Arabic, Traditional Chinese, Urdu, French, Polish) are unreviewed placeholders; a translator must review every string. Russian, Bengali, Haitian Creole and Korean are listed but not translated in the tool.
- No skip-to-content link (see the conformance summary).

## Conventions

- Weights 400 and 600 only. Body 18px. Grey text `#565656`; black `#191919`; primary `#225E7C`.
- Lucide icons on program cards; Material icons elsewhere (e.g. the dashboard help icon).
- Commit messages: `area: what changed` (e.g. `copy: hospital bills handoff phone label`).
- Each drop is a GitHub Release tagged per release; see `CHANGELOG.md`.
