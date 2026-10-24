# Component inventory (v1.3 Save & Continue)

Source of truth for values: `styles/tokens.css` (design tokens) and `styles/components.css` (shared components). Page-specific styles live in the matching `styles/<page>.css`. This list is for the vendor's React build: build each as one component, read all values from the tokens, never hard-code them.

## Rules for every component
- **Tokens only.** Colors, type, spacing, radii and the focus ring come from `tokens.css`. Keep the same variable names in the React theme file.
- **Focus ring:** `--focus-ring` (3px, brand color) with `--focus-ring-offset` (2px) on every interactive element.
- **Mobile first.** Page gutter `--page-margin-x` (16px). Prototype is built and tested at phone width.
- **Gated buttons use `aria-disabled`, not `disabled`.** They stay focusable and point to a hidden hint via `aria-describedby`; activation is blocked in code (`scripts/a11y.js`).
- **Errors** are announced (`role="alert"`) and marked with `aria-invalid` on the input. Status messages use `role="status"` / `aria-live="polite"`.

## Languages and right-to-left
- Every visible string must be translatable (message keys and locale files in production). The prototype's version is `scripts/i18n-strings.js`.
- Arabic is right-to-left. Use logical CSS properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`) instead of left/right, mirror directional icons (back and external-link arrows), and keep numbers, emails, phone numbers and street addresses left-to-right.
- Strings run about 20–30% longer in Spanish; buttons and chips must wrap or grow rather than truncate.
- Do not translate proper names (hospitals, cities, partner and utility names).

## Layout
| Component | Class | Notes |
|---|---|---|
| Top banner ("Official website of the City of New York") | `.top-banner` | Expandable disclosure panel with toggle (`aria-expanded`). |
| Site nav | `.site-nav`, `.site-panel` | Logo, translate button (aria-label "English, translate this page"), menu toggle; language panel. |
| Step layout | `.step`, `.step__body`, `.step__title`, `.step__text`, `.step__footer`, `.step__actions` | Title + text + content, fixed footer with action buttons and a top border. |
| Progress bar | `.progress`, `.progress__seg` | Segments; active uses `--color-accent`, inactive `--color-neutral-200`. |
| Support line | `.support-line`, `.support-mail` | Sentence ending in an email link with a 16px envelope icon. Used on dashboard, profile, paused screen. |

## Actions
| Component | Class | States |
|---|---|---|
| Button, primary | `.btn.btn--primary` | default, hover, pressed, focus, aria-disabled (brand at 30%). Min height 56px, radius `--radius-button`. |
| Button, secondary | `.btn--secondary` | default, hover, pressed, focus. Pill shape inside footers. |
| Button, back | `.btn--back` | Used in step footers. |
| Button, outline | `.btn--outline` | Dashboard cards ("View details"). |
| Text link | `.ext-link` | Brand color, underlined (offset 3px, thickness 1.5px). External links open in a new tab and include "(opens in new tab)" for screen readers. |

## Form inputs
| Component | Class | States / notes |
|---|---|---|
| Text field | `.field`, `.field__label`, `.field__input`, `.field__help`, `.field__error` | default, focus, filled, error (`aria-invalid`). Min height 56px. Masks: phone `###-###-####`, DOB `MM/DD/YYYY`, ZIP 5 digits. |
| Code field | `.signin__code` (on `.field__input`) | 6 digits, numeric keypad, `autocomplete="one-time-code"`. |
| Select | `.select` | Native select styling. |
| Combobox + listbox | `.combobox`, `.listbox` | Searchable list; keyboard arrows, Escape closes. |
| Checkbox | `.checkbox` | unchecked, checked, focus. |
| Choice card (radio) | `.choice-card` | `role="radio"`, `aria-checked`; selected, focus. |
| Money field | `.df-money` | Dollar prefix. |
| Copy field | `.copy-field` | Read-only value with copy button. |

## Feedback
| Component | Class | Notes |
|---|---|---|
| Step error | `.step-error` | Page-level error above fields. Examples: "Enter the 6-digit code we sent you"; "Invalid code. You have N attempts left." |
| Alert (success) | `.signin__alert` | Check icon + text, `--color-success-light` bg, `--color-success-dark` text. "We sent you a new code." Lives in an `aria-live` region. |
| Chip | `.chip`, `.chip--success`, `.chip--in-progress`, `.chip--error` | Status labels ("Referral sent", "No match"). |
| Resend button with countdown | `#resend` | Enabled, or `aria-disabled` while a 30-second countdown runs ("Send a new code in N seconds"). Placeholder timing. |

## Content blocks
| Component | Class | Notes |
|---|---|---|
| Program card (dashboard) | `.app-card` (+ `__head`, `__icon`, `__title`, `__chip`, `__desc`, `__cta`) | Three states: **Get started**, **Referral sent** (chip + date + next-step message + "Start your application" where applicable + "View details"), **No match** (chip + description + "View details"). Title is an `h2`. |
| Location card (not-found screen) | `.signin__loc` | Name link (new tab), address. Background `#FAF8F5` (`--color-pillar-card`). |
| Review card | `.review-card` (+ `__head`, `__title`, `__edit`) | Edit/Done mode via `review-edit.js`. `data-readonly` cards have no Edit. |
| Profile list | `.profile__list` | Label/value pairs, read-only. |
| Handoff view / note | `.handoff-view`, `.handoff-note` | Program handoff page (back link, partner link, next steps); note block on the health insurance next-step page. |
| Numbered next steps | `.nsteps`, `.nstep` (`__num`, `__title`, `__note`, `__need`) | Ordered "what happens next" list on the next-step pages; step number can show a done check. |
| Multi-select tile | `.checkbox.tsu-tile` | Checkbox in a tile (tenant support screener). "None of the above" is exclusive. Error state `.is-invalid`. |
| Bottom sheet + scrim | `.sheet`, `.sheet-scrim` | Slides up; focus moves into sheet, returns on close. |

## Screens that use these (v1.3)
Home, sign-in (contact step, code step, not found, paused), welcome back, dashboard, profile, and the program screeners and handoffs: Dollar For, EAP, EITC, health insurance (incl. site), tenant support.

## Open items for the vendor
- Placeholder values still to be confirmed: code expiry (5 min), resend countdown (30 s), attempt limits (5 wrong codes, then 15-minute pause), "Invalid code" copy, PIN `####` on Dollar For.
- Legacy classes still in `components.css` but unused in v1.3 (carousel, category, featured-row, option-card, partner-row, program-card, site-footer, consent-*): vendor should skip these.
- Component usage was checked by searching the HTML and scripts; confirm nothing is missing.
- Hidden placeholder in `hi-review.html`: "[Consent subtext TBD]" (consent copy not final).
