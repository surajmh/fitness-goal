# Fitness Goal Design System

v1.0 · iOS & Android · light and dark are both first-class.

## Intent

An offline-first strength log. Built for one thumb, one decision, mid-set. A
precision instrument, not a coach — quiet defaults, tabular numerals, and a set
row that never makes you wait on a network.

## Colour

Every colour resolves through a semantic role. Light-mode accents run darker to
hold contrast on white; dark-mode accents run luminous. Data roles are reserved
for charts and movement families. Roles live in
[`libs/shared/ui/src/theme.ts`](libs/shared/ui/src/theme.ts) and are mirrored as
CSS variables in [`apps/mobile/src/global.css`](apps/mobile/src/global.css) —
change both together.

| Role | Light | Dark | Meaning |
| --- | --- | --- | --- |
| `canvas` | `#FFFFFF` | `#070A10` | Page background |
| `surface` | `#F2F3F5` | `#151A22` | Grouped background |
| `surface-raised` | `#FFFFFF` | `#1D232D` | Distinct task surface |
| `ink` | `#101114` | `#F7F9FC` | Primary text |
| `muted` | `#62666D` | `#AAB1BC` | Secondary text |
| `outline` | `#DFE1E5` | `#343D4B` | Borders, dividers |
| `primary` | `#087E6C` | `#94E8D1` | Interaction |
| `on-primary` | `#FFFFFF` | `#061E19` | On primary fills |
| `coral` | `#D72D4C` | `#FF3858` | Data · progress |
| `lime` | `#237A3C` | `#38D16A` | Data · consistency |
| `cyan` | `#096FBD` | `#1689F8` | Data · volume |
| `recovery` | `#7B3AB5` | `#B45CF2` | Data · recovery |
| `on-recovery` | `#FFFFFF` | `#180824` | On recovery fills |
| `success` | `#167C4D` | `#5DD895` | Semantic |
| `warning` | `#9B5A00` | `#F3C558` | Semantic |
| `danger` | `#C82D48` | `#FF5C73` | Semantic |
| `brand` | `#0E8F63` | `#2FD08A` | Mark, splash, icon only |

Soft tints (`primary-soft`, `success-soft`, `danger-soft`, `warning-soft`) back
banners, the rest pill, and completed set fields. `placeholder` and
`placeholder-ink` carry empty and disabled states.

`brand` is a separate role from `primary`: identity never doubles as an
affordance. The mark is an upward-trending "M" fused with a "G" that opens onto
a bullseye — one flat brand green on a rounded tile, never a gradient, and
nowhere but the mark, splash, and app icon.

## Type, numerals, spacing

System family only — SF on iOS, Roboto on Android.

| Use | Size / weight |
| --- | --- |
| Screen title | 34 / 700 |
| Exercise | 26 / 700 |
| Value | 24 / 700, tabular |
| Row title | 16 / 600 |
| Support | 13 / 500 |
| Label | 11 / 700, uppercase |

Every workout value renders tabular so digits never jitter as a timer counts or
a set is logged.

Spacing runs on a 4 pt unit: 4 icon↔label, 8 inside a control, 12 row gutter,
16 compact screen inset, 20 default screen inset, 24 section break. Radii are
12–16 pt; pills are reserved for filters, timers, and compact status. Controls
are never under 48 pt. Lists and dividers beat card grids — a surface only lifts
when it carries a distinct task.

## Set row — highest priority

Four states, one thumb. Weight and reps are the only editable fields; the
completion toggle is a 48 pt tap target on the outer edge.

1. **Empty** — dashed outline, `placeholder-ink` em dash.
2. **Editing** — 2 pt `primary` border on the focused field, raised surface.
3. **Completed** — `success-soft` fill, `success` toggle carrying a check glyph.
4. **Personal record** — a `primary` badge inside the weight field carrying an
   up arrow and the letters `PR`.

A set is a personal record when its weight beats every completed set of the same
exercise before it, earlier sets of the session included. An exercise with no
history cannot set a record.

At Dynamic Type XXL the row stacks: labelled full-width fields at 56 pt and a
full-width "Mark complete" button.

The rest countdown is a pill, never a modal. It keeps running while you edit the
next set; reduced motion freezes the bar and steps it per second.

## Components

Use platform pressables, text inputs, switches, alerts, and back handling.
Shared wrappers in `libs/shared/ui` supply semantic colours, states, and
accessibility.

- **Buttons** — 48 pt, 14 pt radius. Primary fill, secondary 1.5 pt outline,
  danger fill, and bare text actions for "Add set" and "Delete". Disabled is an
  `outline` fill with `placeholder-ink` text.
- **Chips** — 36–48 pt pills. Selected fills `primary` and carries a check.
- **Search** — `surface` fill, 2 pt `primary` border while focused, clear
  affordance once there is a value.
- **Rows** — the workhorse: dense (44 pt) title only, comfortable (56 pt) with
  subtitle, and 68 pt with leading artwork. Dividers inset past the artwork.
- **Banners** — soft-tinted, icon plus title plus optional detail.
- **Empty states** — icon tile on `surface-raised`, centred title and message,
  optional action.

Iconography has three coordinated tiers:

- System icons use the app-owned 24 pt SVG family with 1.8 pt rounded strokes,
  minimal interior detail, and fill only for the current destination and the
  compact play action. Sources live in `libs/shared/ui/src/icons/assets` and are
  compiled by `generate.mjs` — edit the SVG, not the generated component. Each
  tab destination ships an outline glyph and a purpose-drawn `*-filled` twin;
  the bar swaps between them rather than flooding an outline with colour.
  Filled glyphs declare `fill="currentColor"`, which the generator resolves to
  the colour prop — react-native-svg has no `currentColor` of its own.
- Exercise photography is the primary movement artwork: public-domain start/end
  frames, square, cropped to fill, same 12–16 pt radii as other surfaces.
- Fitness figures are the fallback where there is no photograph — single-colour
  silhouettes across press, pull, squat, hinge, core, mobility, and cardio.
  Colour follows the movement role: coral pressing, lime lower body, cyan
  pulling and cardio, violet core, recovery, and mobility.

Do not mix third-party icon families.

## Screens

- **Today** — title, weekday, and an "On device" status pill; three stat tiles
  (Volume in `cyan`, Sessions in `lime`, Streak in `coral`); an "Up next" raised
  card carrying the plan, its meta, and Start workout; then saved plans as a
  grouped list with initials tiles.
- **Active workout** — a compact header with elapsed time and "Saved on device",
  the rest pill, and set rows on canvas. The set being worked lifts onto its own
  surface. Highest-priority screen; see the set-row section above.
- **Exercise picker** — search, filters, a `Scope · N results` label, then 64pt
  rows with 48pt artwork and a 28pt circular add/added control.
- **Plans** — count subtitle, a 44pt primary add button on the title row, and
  one grouped list. A plan being trained right now carries an `ACTIVE` badge.
- **History** — session count and span, a seven-week volume chart, then sessions
  grouped by week behind 44pt date tiles with duration, volume, and set count.
- **Progress** — the History screen's second tab: range chips, estimated 1RM in
  `coral`, weekly volume in `cyan`, Consistency (`lime`) and Recovery
  (`recovery`) stat tiles, then the body check-in form.
- **Settings** — the health card first (raised, 38pt icon tile, tick-and-word
  connected status, last-synced footer), then labelled groups on grouped
  surfaces: Training, Appearance & access, Progressive overload. Closes with a
  quiet on-device info pill. Theme and reduce motion follow the device; the app
  keeps no preference of its own that could disagree with it.

## Motion

150–250 ms, and every transition must say what changed: the row fills on
complete, inserts slide, the timer bar drains. The first incomplete exercise
gets the only continuous preview — a cross-fade between start and end frames,
or a native-driver transform of its movement figure. Reduced motion freezes that
preview in its neutral pose.

## Layout

Phone layouts use a four-destination bottom bar — Today, Plans, History,
Settings — attached to the viewport and participating in layout, never an
overlay or floating card. At ≥ 768 pt the destinations move to a left rail with
the same icons, order, and fill-for-current rule. Active workout controls stay
reachable above the home indicator, navigation bar, and keyboard.

## Principles

- **One thumb, one decision.** Weight, reps, and done sit on one 64 pt band.
  Nothing about logging a set opens a modal.
- **Offline is the normal state.** "Saved on device" is a quiet status, never a
  warning tone. Sync failures never colour the log.
- **Never colour alone.** Completed carries a check, PR carries an arrow and the
  letters, connected carries a tick and a word.
- **Motion that reports.** Nothing animates that isn't telling you something.
