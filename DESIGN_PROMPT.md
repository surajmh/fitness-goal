# Claude Design prompt — Fitness Goal

> Paste everything below the line into Claude Design.

---

Generate a complete design system for **Fitness Goal**, an offline-first strength-training log for iOS and Android (React Native / Expo). Output light and dark variants for every component — both themes are first-class, not an afterthought.

## Product context

People who train with weights or mixed modalities and need to record a workout **quickly, between sets, with unreliable gym connectivity**. The core job is planning, executing, and reviewing training without ever waiting on a network request. Everything works on-device.

The user is usually standing, mid-session, slightly out of breath, holding the phone in one hand. Design for that moment.

## Brand personality

Focused, capable, encouraging. It should feel like **well-made training equipment**: precise under pressure, quiet when it should be, satisfying to use repeatedly. A precision instrument, not a coach shouting at you.

## Anti-references — actively avoid these

- Gamified neon fitness dashboards
- Generic stacks of oversized cards
- Web-style controls ported into a native shell
- Decorative gradients
- Common logging actions hidden behind modal layers

## Design principles

1. Keep the active set within **one thumb and one decision**.
2. Show training context only at the moment it changes a choice.
3. Treat offline as the **normal state**, never an error state.
4. Prefer familiar native behaviour over novelty.
5. Make progress legible without turning every screen into a dashboard.

## Colour tokens

Use these exact values. All colour resolves through semantic roles — never hardcode raw hex in components.

| Role | Light | Dark | Meaning |
|---|---|---|---|
| `canvas` | `#FFFFFF` | `#070A10` | Page background |
| `surface` | `#F2F3F5` | `#151A22` | Grouped background |
| `surface-raised` | `#FFFFFF` | `#1D232D` | Distinct task surface |
| `ink` | `#101114` | `#F7F9FC` | Primary text |
| `muted` | `#62666D` | `#AAB1BC` | Secondary text |
| `outline` | `#DFE1E5` | `#343D4B` | Borders, dividers |
| `primary` | `#087E6C` | `#94E8D1` | Interaction / accent |
| `on-primary` | `#FFFFFF` | `#061E19` | Text on primary fills |
| `coral` | `#D72D4C` | `#FF3858` | Progress (data role) |
| `lime` | `#237A3C` | `#38D16A` | Consistency (data role) |
| `cyan` | `#096FBD` | `#1689F8` | Volume (data role) |
| `recovery` | `#7B3AB5` | `#B45CF2` | Recovery (data role) |
| `on-recovery` | `#FFFFFF` | `#180824` | Text on recovery fills |
| `success` | `#167C4D` | `#5DD895` | Semantic |
| `warning` | `#9B5A00` | `#F3C558` | Semantic |
| `danger` | `#C82D48` | `#FF5C73` | Semantic |

Rules:
- Primary fills **always** pair with `on-primary`.
- Light-mode accents are deliberately darker than their dark-mode counterparts to hold contrast on white.
- The four data roles (coral / lime / cyan / recovery) are for **charts and movement families only** — they are not decorative.
- Luminous or high-saturation treatment belongs to the brand mark and key data, **not** to every control.

### Brand mark

A single-colour mark: an upward-trending "M" (progress) fused with a "G" that opens onto a bullseye whose tongue points at the centre (goal). It sits on a rounded tile — dark `#16181D` in dark mode, white in light mode.

Brand green is `#2FD08A` on dark / `#0E8F63` on white. **Treat this as a distinct `brand` token, separate from `primary`.** `primary` drives interaction; `brand` appears only in the mark, splash, and app icon. Please surface both on the colour card so the relationship is explicit.

## Typography

Platform system family — San Francisco on iOS, Roboto on Android. No custom webfonts.

- Screen titles: decisive and oversized
- Supporting labels: compact, to preserve scan speed between sets
- **All workout values (weight, reps, timer, volume) use tabular numerals** so digits don't jitter as they change
- Must respect Dynamic Type / system font scaling — show how each component reflows at large text sizes

## Shape, spacing, motion

- 4pt spacing unit
- 12–16pt surface radii
- Pills reserved for filters, timers, and compact status — nothing else
- Controls **minimum 48pt high**, comfortable one-handed spacing
- Lists and dividers preferred over card grids; elevate a surface only when it represents a distinct task
- Transitions 150–250ms, and they must communicate state: completing a set, inserting a set, changing a filter, starting a rest timer
- Reduced-motion mode freezes any looping preview in a neutral pose

## Components to generate

For each: all variants, plus **default / pressed / disabled / loading / focused** states where applicable, in both themes.

1. **PrimaryButton** — variants `primary`, `secondary`, `danger`; supports leading icon, loading spinner, disabled
2. **TextButton** — standard and `destructive`
3. **Row** — list row with title, optional subtitle, optional leading slot (image or icon), optional trailing slot, optional divider. This is the workhorse — show it dense and comfortable, with and without leading artwork
4. **FilterChip** — selected / unselected pill
5. **SearchField** — empty, typing, filled-with-clear-affordance
6. **ScreenTitle** — title with optional subtitle
7. **EmptyState** — title, message, optional action button
8. **FeedbackBanner** — tones `success`, `error`, `info`
9. **ProgressChart** — sparkline/line chart with label and unit, using the data roles
10. **HealthSyncCard** — connection status, last-synced time, enable/disable control
11. **Icon set** — 24pt, 1.8pt rounded strokes, minimal interior detail; fill only for the current nav destination and the compact play action
12. **Exercise thumbnail** — square photo thumbnail with rounded corners and a vector-figure fallback for exercises without a photo
13. **Set row** — the single most important component: set number, weight input, reps input, completion toggle. Must be usable with one thumb, mid-set. Show empty / filled / completed / personal-record states
14. **Rest timer** — active countdown and idle states
15. **Bottom tab bar** — **four** destinations: Today, Plans, History, Settings. Attached to the viewport and participating in layout — never an overlay or floating card. At tablet widths these move to a left rail; show both

## Screens to compose

Assemble the components into these, light and dark:

- **Today** — momentum, volume, what comes next; quick-start actions and saved plans
- **Plans** — list of workout plans grouped by difficulty (Beginner / Intermediate / Advanced), plus plan detail and plan builder
- **Exercise picker** — searchable, filterable catalogue with photo thumbnails
- **Active workout** — the screen users stare at most: current exercise, set logging, rest timer, and a looping start↔end movement preview. Optimise ruthlessly for one-handed use
- **History** — past sessions and a session detail view
- **Progress** — charts over time using the data roles
- **Settings** — preferences, units, health sync

## Accessibility — non-negotiable

- 44pt iOS / 48dp Android minimum touch targets
- Dynamic Type and system font scaling
- Safe-area and keyboard insets respected
- Light and dark appearance
- Reduced-motion support
- Clear focus labels
- **Completion and status must never rely on colour alone** — pair every colour cue with an icon, label, or shape

## Deliverable

A cohesive system where the components visibly belong to one family, with tokens defined once and reused. Show the type scale, the colour ramp (including the `brand` vs `primary` distinction), spacing scale, and every component's states — then the assembled screens.

Prioritise the **active workout** and **set row** above everything else. If a decision is contested, resolve it in favour of speed and legibility mid-set.
