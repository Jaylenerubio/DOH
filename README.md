# NYC Health and Affordability Connector — prototype

Static HTML/CSS/JS prototype of the Connector: a screening tool that checks whether a New Yorker may qualify for five programs and hands them to the right application or referral. This repository is the design specification for the production build — the pages, copy, states, and interactions are the reference; the code is not meant to be reused as-is.

No build step. No dependencies. Open `home.html` in a browser, or serve the folder (`npx serve .`). The deployed copy on Vercel uses `vercel.json` (clean URLs).

## Channels

**Self-service (New Yorker).** Entered from `home.html`; sets `nyc.channel = 'self'`.

```
home → programs → privacy → contact → contact-method → profile-created
     → first chosen program's screener → handoff → dashboard
returning: signin (or returning, if contact details match) → code → welcome-back → dashboard
```

**CHW-assisted (staff).** Entered from `language.html`; four-step intake with a review page, then programs chained one after another. Pages are shared with the self-service channel; `scripts/banner.js`, `scripts/pillars.js` and `scripts/handoff-view.js` switch behavior on `nyc.channel`.

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
| `scripts/pillars.js` | Program config, completion/applied/outcome state, handoff wiring. |
| `scripts/dashboard.js` | Dashboard card states and CTAs. |
| `scripts/handoff-view.js` | Handoff pages when opened from the dashboard (`?from=dashboard`). |
| `scripts/banner.js` | Self-service header: Menu / language panels, desktop links, sign-out. |
| `scripts/mask.js` | Masked phone/email and the demo returning-client match. |
| `scripts/a11y.js` | Live region, step errors, focus helpers. |
| `assets/` | Logo, icons, illustrations. |
| `accessibility-conformance-summary.html` | WCAG 2.2 AA conformance notes, automated-scan results, known gaps. |

Runtime copy (dashboard status sentences, dated handoff intros, language list) is in the scripts above; everything else is in the HTML.

## State

Everything is `sessionStorage`; nothing is sent anywhere. Clearing the tab resets the prototype.

| Key | Holds |
|---|---|
| `nyc.channel` | `'self'` or unset (CHW) |
| `nyc.contact` | `{ firstName, lastName, dob, zip, phone, email }` |
| `nyc.contactMethod` | `'text'` / `'call'` / `'email'` |
| `nyc.recordId` | set when the profile is created |
| `nyc.programs` | chosen program keys, in page order |
| `nyc.completed`, `nyc.completed.<key>` | screened programs, and when |
| `nyc.applied`, `nyc.applied.<key>` | partner application started, and when |
| `nyc.submitted.<key>` | partner confirmed receipt (demo only: `dashboard.html?demo=submitted`) |
| `nyc.outcome.<key>` | `'eligible'` / `'ineligible'` |
| `nyc.returning` | `'pending'` / `'verified'` / `'new'` |
| `nyc.language` | chosen language code (stored and announced; no translation in the prototype) |
| `nyc.df`, `nyc.hi`, `nyc.tsu`, `nyc.eap`, `nyc.eitc` | per-program answers |

Demo returning client: phone `917-555-2222` or `ana@example.com`, ZIP `10457`, DOB `03/15/1988`. Any 6 digits verify. All names, numbers and sites are fictional.

## Dashboard states

| State | Chip | CTA |
|---|---|---|
| Not started | — | Get started |
| Screener incomplete | In progress | Continue |
| Screened, not applied | Screened | Start your application + View details |
| Application started | Awaiting response | View details |
| Partner confirmed (demo) | Submitted | View details |
| Not eligible | Not eligible | View details |

## Placeholders the production build must replace

- Energy discounts: Benefits Enrollment Assistance intake URL (`#bea-partner-intake-placeholder` in `scripts/pillars.js` and `eeap-next.html`).
- Hospital bills: `https://dollarfor.org/` stands in for the simplified-application link.
- Privacy policy link on `privacy.html` (`href="#"`).
- Enrollment-site names, addresses, hours and phone numbers (`scripts/hi-sites.js`).
- "Submitted" / "received" wording depends on a partner status feed that does not exist yet.
- No translated strings; no skip-to-content link (see the conformance summary).

## Conventions

- Weights 400 and 600 only. Body 18px. Grey text `#565656`; black `#191919`; primary `#225E7C`.
- Lucide icons on program cards; Material icons elsewhere.
- Commit messages: `area: what changed` (e.g. `copy: hospital bills handoff phone label`).
- Each drop is a GitHub Release tagged `vX.Y-self-service`; see `CHANGELOG.md`.
