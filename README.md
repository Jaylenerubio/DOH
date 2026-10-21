# NYC Health and Affordability Connector — prototype

Static HTML/CSS/JS prototype of the Connector: a screening tool that checks whether a New Yorker may qualify for five programs and hands them to the right application or referral. This repository is the design specification for the production build — the pages, copy, states, and interactions are the reference; the code is not meant to be reused as-is.

No build step. No dependencies. Open `home.html` in a browser, or serve the folder (`npx serve .`). The deployed copy on Vercel uses `vercel.json` (clean URLs).

## Release: v1.3 Save & Continue

A HART employee (CHW) starts the client's record in the Blooming Health CRM; the client finishes at home. This branch has **no intake or account-creation pages**. The public self-service flow (landing, programs, privacy, contact, account created, "Starting [program]") is on branch `v1.4-Self-service`.

```
home ("Resume your session") → signin (phone + ZIP + DOB) → 6-digit code → welcome-back → dashboard
dashboard → "View details" (static handoff page) · "Start your application" (partner link) · My profile
```

- Sign-in finds the record by phone + ZIP + DOB. No match shows "We couldn't find your account" with a route to a pilot location and "Try again".
- "Verify by email" / "Verify by text" on the code step offers a masked email, only if an email is on file (phone first). Users never type an email.
- Sets `nyc.channel = 'self'`.

## Programs

| Key | Name | Screener | Handoff (eligible) | Not eligible |
|---|---|---|---|---|
| `hospital-bills` | Hospital bills (Dollar For) | `dollarfor` → `df-bill` → `df-self` → `df-review` | `df-next` | `df-ineligible` |
| `medicaid` | Health insurance | `hi` → `hi-site` → `hi-review` | `hi-next` | — |
| `anti-eviction` | Eviction (Tenant Support Unit) | `tsu` → `tsu-review` | `tsu-connected` | `tsu-311` |
| `financial-help` | Energy discounts (EAP / EEAP) | `eap` → `eap-review` | `eeap-next` | `eap-ineligible` |
| `tax-credits` | Tax credits (EITC) | `eitc` → `eitc-review` | `eitc-eligible` | `eitc-ineligible` |

Program order, labels, descriptions, entry pages and partner application URLs live in `scripts/pillars.js` (`ORDER`, `META`, `APPLY`).

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
| `scripts/mask.js` | Masked phone/email and the demo returning-client match. |
| `scripts/a11y.js` | Live region, step errors, focus helpers. |
| `assets/` | Logo, icons, illustrations. |
| `accessibility-conformance-summary.html` | WCAG 2.2 AA conformance notes, automated-scan results, known gaps. |

Runtime copy (dashboard status sentences, language list) is in the scripts above; everything else is in the HTML.

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
| `nyc.language` | chosen language code (stored and announced; no translation in the prototype) |
| `nyc.df`, `nyc.hi`, `nyc.tsu`, `nyc.eap`, `nyc.eitc` | per-program answers |

Demo client: phone `917-555-2222`, ZIP `10457`, DOB `03/15/1988` (anything else shows "We couldn't find your account"). Any 6 digits verify. The demo record seeds no results: every program shows "Get started" until a screener and handoff are completed. In production the vendor fills these from what the client did with the CHW in person. All names, numbers and sites are fictional.

## Dashboard states

Programs with a result come first, then the rest, under the two-tone "Explore programs & applications for you" H1 (small "Hi, {name}" above it). The in-person support link sits at the bottom. SNAP is hidden for now. Clicking a partner link does not change state.

| State | Chip | Body | CTAs |
|---|---|---|---|
| Not started | none | Program description | Get started |
| Eligible | Referral sent | "Referral sent {Month d, yyyy}. {program message}" | Start your application (Hospital bills, Energy discounts, Tax credits only) + View details |
| Not eligible | No match | Program description | View details |

## Placeholders the production build must replace

- Dollar For PIN shown as `####` in the Hospital bills dashboard message.
- Code expiry ("5 minutes"), the 30-second resend countdown and the "We sent you a new code. Expires in 5 minutes." alert copy are placeholders.
- Links still TBD: pilot location (not-found screen), in-person support (dashboard help message), account deletion ("Request account deletion" has no modal or destination).
- Energy discounts: Benefits Enrollment Assistant intake URL (`#bea-partner-intake-placeholder` in `scripts/pillars.js` and `eeap-next.html`).
- Hospital bills: `https://dollarfor.org/` stands in for the simplified-application link.
- Enrollment-site names, addresses, hours and phone numbers (`scripts/hi-sites.js`).
- "Connect with a HART employee" link on No match cards: TBD, left out.
- Program names and descriptions: pending JL content review.
- No translated strings; no skip-to-content link (see the conformance summary).

## Conventions

- Weights 400 and 600 only. Body 18px. Grey text `#565656`; black `#191919`; primary `#225E7C`.
- Lucide icons on program cards; Material icons elsewhere (e.g. the dashboard help icon).
- Commit messages: `area: what changed` (e.g. `copy: hospital bills handoff phone label`).
- Each drop is a GitHub Release tagged per release; see `CHANGELOG.md`.
