---
target: every mobile screen and flow
total_score: 20
p0_count: 1
p1_count: 3
timestamp: 2026-07-30T12-45-16Z
slug: apps-mobile-src
---
# Fitness Goal — Complete Screen and Flow Critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2 | Set completion and timer are clear; saves and failures are mostly silent. |
| 2 | Match with the real world | 3 | Plans, sets, reps, and weight map well to training; estimated 1RM and overload rules need explanation. |
| 3 | User control and freedom | 1 | No interrupted-workout recovery, native Back stack, set removal, undo, or history drill-in. |
| 4 | Consistency and standards | 2 | Internal components are consistent, but custom navigation and icons miss iOS/Android conventions. |
| 5 | Error prevention | 2 | Required buttons disable correctly, but numeric inputs accept invalid and implausible values. |
| 6 | Recognition rather than recall | 2 | Labels are clear, but previous workout values are absent during the core logging task. |
| 7 | Flexibility and efficiency | 2 | Repeat-workout is useful; set duplication, increments, and quick previous-value entry are missing. |
| 8 | Aesthetic and minimalist design | 3 | Restrained, calm, and legible; screen composition becomes repetitive. |
| 9 | Error recovery | 1 | Bootstrap errors are terminal and raw; mutations have no retry, undo, or visible failure path. |
| 10 | Help and documentation | 2 | Empty states teach well; advanced concepts and settings behavior remain unexplained. |
| **Total** |  | **20/40** | **Promising visual foundation; workflow is not release-ready.** |

## Anti-patterns verdict

**LLM assessment:** The interface passes the AI-slop test. The restrained olive palette, system typography, list-first structure, useful copy, and semantic tokens feel credible. The weakness is prototype completeness: the same title/subtitle, rounded surface, and button cadence repeats while essential fitness-log affordances are missing.

**Deterministic scan:** The bundled detector returned `[]` with exit code 0. This is a false-clean signal because it parses web HTML/CSS and does not recognize native React Native TSX semantics. Native source and simulator evidence found the issues below.

**Visual overlays:** No browser overlay exists. This is a native simulator surface without a DOM or injectable script. Simulator screenshots and source inspection were used instead.

## Overall impression

The app looks calm, focused, and unusually coherent for an early build. Its strongest moment is the active set row. Its largest opportunity is to make the product as trustworthy as its offline-first promise: preserve an interrupted workout, surface previous performance, support set manipulation, and make every write visibly safe.

## Flow-by-flow review

| Flow | What works | Main gap |
|---|---|---|
| Bootstrap/loading/error | Reassuring local-storage copy | Static loading; raw terminal error with no retry |
| Today | Clear empty-workout CTA, repeat-last shortcut, useful empty state | No recovery banner for unfinished sessions |
| Plan list | Simple hierarchy | Saved plans cannot be opened, edited, reordered, duplicated, or deleted |
| Plan builder: name | Clear step count and keyboard avoidance on iOS | Cancel discards without warning; inputs lack programmatic labels |
| Plan builder: exercises | Search and local filters are useful | Two hidden horizontal filter rows create load; zero-results state is blank |
| Plan builder: review/save | Concise summary | Cannot change sets, reps, or order despite being a workout plan |
| Active workout | Best screen: compact set row, explicit completion, rest feedback | No previous values, add/remove/duplicate set, remove exercise, notes, or RPE/RIR |
| Rest timer | Highly visible and stateful | `+30s` inherits low-contrast primary text on a primary fill; minus icon does not mean cancel |
| Finish workout | Native confirmation and cancel path | No summary, celebration, correction, or undo after finishing |
| History | Helpful empty-state copy | Row tap immediately starts a duplicate instead of opening history detail |
| Progress | Clear baseline empty state; chart has an accessibility summary | No dates/axis context, unexplained estimated 1RM, unsafe body inputs |
| Settings | Native unit switch and clear grouping | Unit is not persisted; rest timer looks editable but is fixed; overload save is silent |
| Global navigation/adaptation | Five tabs are understandable and targets are large | Custom state shell has no native stack/back gestures, tablet rail, or expanded layout |
| Dark appearance | Semantic dark tokens exist | Simulator stayed visually light in dark mode; only the status bar adapted |

## What is working

1. The set editor keeps weight, reps, and completion in one compact decision cluster with explicit screen-reader labels.
2. Offline operation is described as the normal product state rather than an error or degraded mode.
3. The OKLCH semantic palette, restrained accent usage, light/dark token intent, and system typography form a strong foundation.

## Priority issues

### [P0] Interrupted workouts become inaccessible

**Why it matters:** `activeSessionId` lives only in React state. A restart returns users to Today while the unfinished session remains hidden in the database. That directly violates the product's core promise of dependable local logging.

**Fix:** Query for an unfinished session during bootstrap, restore it automatically, add a prominent Resume Workout state on Today, and persist the weight unit.

**Suggested command:** `$impeccable harden`

### [P1] The mid-set workflow omits the context serious lifters need

**Why it matters:** Users must remember prior weights/reps and cannot add, remove, or duplicate sets. The logger becomes slower than paper precisely when attention is scarce.

**Fix:** Show prior-session values inline, add set ±/duplicate actions per exercise, support exercise removal/reordering, and keep common actions within one thumb.

**Suggested command:** `$impeccable shape`

### [P1] Navigation is neither fully iOS-native nor Android-native

**Why it matters:** Boolean/step state replaces a navigation stack, so Android predictive Back and iOS edge-swipe cannot unwind builders, pickers, or workouts. Tablet support is declared without an expanded layout.

**Fix:** Introduce a native stack inside the five top-level destinations; preserve system Back/edge-swipe; use a rail or adaptive layout at expanded widths; use platform icon conventions where practical.

**Suggested command:** `$impeccable adapt`

### [P1] Writes and numeric inputs are silent and unsafe

**Why it matters:** Plan, metric, overload, and set writes have little loading/error/success feedback. Negative, non-finite, and implausible values can be stored, undermining trust in progress data.

**Fix:** Add domain validation, inline error copy, loading/double-submit guards, accessible saved confirmation, retry, and undo where consequences are meaningful.

**Suggested command:** `$impeccable harden`

### [P2] Review and management destinations do not support review or management

**Why it matters:** History starts a workout instead of showing results; Plans cannot open saved plans; the rest-timer row looks configurable but is inert.

**Fix:** Make history rows open session detail and expose Repeat separately. Add plan detail/edit/delete. Either make rest duration editable or present it as informational text.

**Suggested command:** `$impeccable clarify`

## Persona red flags

**First-time lifter:** “Estimated 1RM,” “trigger reps,” and overload behavior are unexplained. History unexpectedly starts a repeated workout. The builder imposes 3×8 without teaching or allowing adjustment.

**Experienced lifter mid-workout:** No previous values, set manipulation, RPE/RIR, warm-up/drop-set type, notes, or editable rest duration. Restarting the app can strand the session.

**Accessibility user:** Six of nine text inputs lack programmatic labels. Several 44dp controls miss Android's 48dp minimum. Fixed-width set columns and a fixed-height tab bar may crowd at large font sizes. Exercise-row selected state is visual only. Positive evidence includes labeled set fields, checkbox semantics, selected tab state, and a labeled native switch.

## Minor observations

- Long vertical collections render inside `ScrollView`; use virtualized lists as histories and catalogs grow.
- The exercise picker has no zero-results message.
- Loading is not announced as live status and has no activity indicator.
- No authored motion means reduced-motion support is not currently a defect.
- Literal white icons on a lighter dark-mode primary need contrast verification.
- Today and Plans partially overlap; keep Today focused on resume/start and Plans on management.

## Questions to consider

1. Is restart recovery a release blocker? For an offline-first log, it should be.
2. Is the primary audience a serious repeat lifter? If yes, previous values and set manipulation outrank Progress polish.
3. Should History optimize for review or repeat? The current label promises the former while the interaction performs the latter.
4. Is the 90-second rest timer intentionally fixed for v1? The Settings presentation promises configurability.
