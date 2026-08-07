# Fitness Goal — Relume App UI Brief

## 1. Relume master prompt

Copy the following block into Relume as the primary project prompt. Use the remaining sections of this document as screen-level detail when refining the generated sitemap and wireframes.

> Design a responsive, native-feeling workout tracking app called **Fitness Goal**. It is an offline-first training log for people who lift weights or combine strength, cardio, mobility, and bodyweight training. The product must make planning, logging, and reviewing workouts feel immediate and dependable even with no internet connection.
>
> Create an authenticated-style product interface without a sign-in flow. The current product is single-user and device-local. Do not design a marketing website, social feed, coaching marketplace, subscription paywall, leaderboard, calorie tracker, or AI chat assistant.
>
> The app has four primary destinations: **Today**, **Plans**, **History**, and **Settings**. On phones, use a fixed native bottom navigation bar. On tablets and desktop-width previews, replace it with a compact left navigation rail. When a workout is active, hide the global navigation and show a focused full-screen workout experience.
>
> The primary user is standing in a gym, moving between sets, often holding a phone in one hand. Optimize for fast scanning, large touch targets, minimal typing, direct inline editing, and reliable state feedback. Keep the active set within one thumb and one decision. Show previous performance beside the set being edited. Starting, completing, duplicating, and undoing a set must be obvious.
>
> Use a restrained, precise visual system inspired by well-made training equipment: bright white and cool graphite in light mode; technical blue-black and charcoal in dark mode. Use deep teal in light mode and luminous mint in dark mode for primary actions and selected navigation. Reserve coral, lime, cyan, and violet for meaningful performance categories. Avoid decorative gradients, neon-gaming aesthetics, glassmorphism, excessive shadows, oversized card grids, and web-style controls that feel ported into a mobile shell.
>
> Use the platform system font, tabular numerals for workout values, 12–16 px corner radii, clear dividers, and lists instead of turning every section into a card. All controls require accessible labels, visible focus/selected states, light and dark variants, and minimum touch targets of 44 pt on iOS and 48 dp on Android. Respect safe areas, keyboard insets, Dynamic Type/font scaling, high contrast, reduced motion, and system back behavior.
>
> Generate the following screens and states: local data preparation/loading; Today dashboard; empty and populated Today states; active workout; empty active workout; exercise picker; Plans list; three-step plan builder; plan detail; edit plan; History workout list; workout detail; Analytics with body-weight and estimated-1RM charts; Settings with units, rest timer, health sync, and progressive overload rules; confirmation dialogs; inline validation; success/error feedback; empty results; and disabled/loading states.
>
> Use realistic workout data in wireframes, such as Bench Press, Barbell Row, Back Squat, Romanian Deadlift, 3 sets × 8 reps, 80 kg, RPE 8, 90-second rest, and weekly volume. Do not use lorem ipsum.

## 2. Product definition

### Product name

**Fitness Goal**

### One-line description

An offline-first training log for planning workouts, recording sets quickly, and reviewing measurable progress without waiting for a network connection.

### Product promise

Workout data is immediate, complete, and trustworthy whether the device is online or offline.

### Product personality

- Focused: removes distractions during training.
- Capable: supports real workout detail without feeling complicated.
- Encouraging: makes progress legible without childish rewards or pressure.
- Precise: behaves like dependable training equipment.

### Primary user

A person who trains with weights or mixed modalities and needs to record a workout while moving between sets. They may have sweaty hands, limited attention, bright or dim ambient light, and unreliable gym connectivity.

### Primary jobs to be done

1. Start a workout immediately, from a plan, or by repeating a previous session.
2. Record weight, repetitions, and perceived exertion with minimal taps.
3. Compare the current set with previous performance.
4. Run and adjust a rest timer without leaving the workout.
5. Build repeatable workout plans from a large local exercise catalog.
6. Review session history, volume, body metrics, and estimated strength trends.
7. Configure units, rest duration, health integration, and overload rules.

### Current product boundaries

- Single local user; no account creation or authentication UI.
- Device-local database is the source of truth.
- A catalog of approximately 1,324 exercises is seeded locally.
- Apple Health or Health Connect data can be read with permission and stored locally.
- A future sync protocol is reserved, but cloud persistence is not currently part of the product.
- Offline operation is normal and should not be represented as an error or warning state.

### Explicitly out of scope

- Social feed, friends, sharing, rankings, streak pressure, or competitive badges.
- Meal planning, calorie counting, sleep coaching, or wearable dashboards.
- Personal-trainer marketplace, chat, or video calls.
- Payments, subscriptions, upsells, or advertisements.
- AI-generated workout coaching.
- Account, team, or organization management.
- Cloud-sync controls until authentication and backend persistence exist.

## 3. Information architecture

### Global navigation

| Destination | Purpose | Key action |
| --- | --- | --- |
| Today | See current momentum and start/resume training | Start workout |
| Plans | Create and manage reusable workout templates | Create plan |
| History | Review completed workouts and progress trends | Open workout / save body check-in |
| Settings | Manage device-local training preferences | Save preference or rule |

### Navigation behavior

- Compact phone: four-item bottom navigation with icon and text label.
- Expanded width: compact left rail with the same destinations.
- Active workout: remove global navigation to protect focus and screen space.
- Top-level screens use large, decisive titles; detail screens use a clear back action and smaller contextual title behavior.
- Preserve native iOS edge-swipe back and Android system/predictive back behavior.
- Never use the navigation bar itself as a workout action bar.

### Screen map

```text
App launch
├── Preparing local log
├── Preparation error + retry
└── Product shell
    ├── Today
    │   ├── Start empty workout
    │   ├── Start from plan
    │   ├── Repeat last workout
    │   └── Resume active workout
    ├── Plans
    │   ├── Plan builder
    │   │   ├── Name session
    │   │   ├── Choose exercises
    │   │   └── Review targets and order
    │   └── Plan detail
    │       ├── Start workout
    │       ├── Duplicate plan
    │       ├── Edit metadata
    │       └── Delete plan
    ├── History
    │   ├── Workouts
    │   │   └── Workout detail
    │   │       ├── Repeat workout
    │   │       └── Delete workout
    │   └── Analytics
    │       └── Save body check-in
    └── Settings
        ├── Weight unit
        ├── Default rest timer
        ├── Health sync
        └── Progressive overload rules

Active workout
├── Add/search/filter exercise
├── Edit and complete sets
├── Rest timer
├── Notes
├── Finish workout
└── Discard workout
```

## 4. Detailed screen specifications

### 4.1 Local log preparation

**Purpose:** Prepare the device-local database and exercise catalog before the app shell appears.

**Layout and content:**

- Centered product symbol.
- Title: “Preparing your local log”.
- Supporting text: “Your exercise catalog is being saved on this device.”
- Use a calm skeleton/progress treatment; do not imply that internet access is required.

**Error state:**

- Title: “Unable to open your log”.
- Explain that existing on-device data is safe.
- Primary action: “Try again”.
- Do not show destructive reset actions here.

### 4.2 Today

**Purpose:** Answer three questions quickly: Is a workout active? How is training going? What should I start next?

**Priority order:**

1. Brand identifier and “Your training” screen title.
2. Active workout resume banner, only when a session exists.
3. Current performance summary.
4. Seven-day training rhythm.
5. Start/repeat actions.
6. Saved plans list.

**Performance summary:**

- Three color-independent metrics: completed sets, completed sessions, and total training volume.
- Each metric includes an icon, current value, and target context.
- Performance rings may visualize the same three metrics but must also have a readable text summary.
- Example values: “14 sets / 20-set goal”, “3 sessions / 4-session goal”, “14,820 kg / 20,000 kg goal”.

**Weekly rhythm:**

- Simple seven-day bar chart with day labels.
- Use active/inactive shape and contrast, not color alone.
- Avoid a dense analytics dashboard on this screen.

**Actions:**

- Primary: “Start an empty workout”.
- Secondary, when history exists: “Repeat last workout”.
- Saved plan rows each expose plan name, short description, and play affordance.
- Disable workout-start actions when another workout is already active.

**States:**

- Active session: prominent “Workout in progress — Resume saved session”.
- No plans: educational empty state with a route to Plans through the global navigation.
- Start failure: inline error banner; reassure the user that saved data is unchanged.

### 4.3 Active workout

**Purpose:** Make set logging fast, forgiving, and usable with one hand.

**Global behavior:**

- Full-screen focused mode; global navigation is hidden.
- Header shows “Active workout”, completed-set count, and a “Finish” action.
- Data saves locally as it changes. Avoid a persistent global Save button.
- The first exercise containing an incomplete set is the active exercise.

**Rest timer:**

- Appears near the top after a set is marked complete.
- Shows mm:ss using tabular numerals.
- Includes “+30s” and cancel controls.
- Uses the recovery color role (violet) and remains readable in light/dark mode.
- Local notification behavior may continue when the app is backgrounded.

**Exercise group:**

- Exercise figure/artwork, name, muscle group, and equipment.
- Move up, move down, and remove controls with accessible labels.
- Only the active exercise may show a subtle movement preview; reduced motion freezes it.
- Each exercise contains a compact set table, not separate cards for every set.

**Set table columns:**

- Set number.
- Weight in selected unit.
- Repetitions.
- RPE.
- Complete checkbox/action.
- Overflow actions.

**Set-row behavior:**

- Numeric inputs use the correct numeric keyboard.
- Show previous matching set beneath the row, for example: “Previous: 77.5 kg × 8 · RPE 8”.
- Completion first validates and saves the edited values, then marks the set complete and starts the configured rest timer.
- Completed state uses both a check symbol and distinct filled treatment.
- Overflow menu: duplicate set, delete set, cancel.
- Inline validation belongs directly beneath the affected row.
- Provide “Add set” below the table.

**Workout-level actions:**

- Add exercise via searchable local exercise picker.
- Undo last completed set.
- Optional multiline workout notes, saved on blur.
- Finish workout with confirmation summarizing completed sets and total volume.
- Discard workout as a visually separated destructive action with confirmation.

**Empty workout state:**

- Title: “This workout is empty”.
- Explain that exercises come from the local catalog and appear instantly.
- Primary action: “Add first exercise”.

### 4.4 Exercise picker

**Purpose:** Find an exercise quickly within a large offline catalog.

**Layout:**

- Persistent search field at the top.
- Horizontally scrollable muscle-area filters.
- Second row of equipment filters.
- Result count.
- Efficient list rows with exercise artwork, name, muscle group, equipment, and selection control.
- Initially render a manageable batch (approximately 60) with a “Show more” action.

**Behavior:**

- Search and filtering operate locally with immediate results.
- Selected exercises use a check plus filled selection treatment.
- In plan creation, allow multi-select.
- During an active workout, selecting an exercise adds it and returns to the workout.
- Empty search state: “No exercises match” with instruction to broaden search or clear filters.

### 4.5 Plans list

**Purpose:** Manage repeatable workout templates.

**Content:**

- Screen title “Plans”.
- Subtitle that plans remain editable during training.
- Primary action: “Create workout plan”.
- Rows show plan name, exercise count, and optional description.
- Most recently updated plans appear first.

**States:**

- Empty: “Build your first plan” plus concise explanation.
- Success feedback: “Workout plan saved.” or “Plan deleted.”

### 4.6 Plan builder — step 1: Name session

**Purpose:** Establish recognizable plan metadata.

**Elements:**

- Cancel action.
- “Step 1 of 3” plus accessible three-part progress indicator.
- Required plan name.
- Optional multiline description.
- Primary action: “Choose exercises”.

**Validation:**

- Name is required; show “Enter a plan name to continue.” after the field is touched.
- Disable forward navigation until the name is valid.
- If Cancel is used after changes, protect against accidental loss.

### 4.7 Plan builder — step 2: Choose exercises

**Purpose:** Select exercises from the local catalog.

**Elements:**

- “Step 2 of 3” and progress indicator.
- Selected count in subtitle.
- Full exercise picker with search and filters.
- Primary action: “Review plan”.
- Secondary action: “Back”.

**Rules:**

- Require at least one selected exercise.
- Keep selections when search terms and filters change.

### 4.8 Plan builder — step 3: Review plan

**Purpose:** Confirm order and set targets before saving.

**Elements:**

- Plan metadata summary.
- Ordered exercise list.
- Move up/down controls for each exercise.
- Sets and reps numeric inputs, defaulting to 3 × 8.
- Primary action: “Save workout plan”.
- Secondary action: “Back”.

**Validation:**

- Sets and reps must each be an integer of 1 or greater.
- Place “Enter 1 or more” below invalid fields.
- Disable save while targets are invalid or save is in progress.
- Show a clear inline error if the local transaction fails.

### 4.9 Plan detail and edit

**Purpose:** Review a reusable plan and choose an action.

**Plan detail content:**

- Back to plans.
- Plan name and description.
- Summary of exercise count and planned-set count.
- Ordered exercise list with target sets × reps.
- Primary action: “Start this workout”.
- Secondary actions: duplicate plan; edit name and description.
- Separated destructive action: delete plan.

**Edit mode:**

- Edit only name and description in the current MVP.
- Validate required name.
- Actions: Save changes and Cancel editing.

**Confirmations and feedback:**

- Confirm deletion and explain that the saved plan is removed.
- Use loading states to prevent duplicate start, copy, or save operations.

### 4.10 History — workouts tab

**Purpose:** Provide a durable chronological record of completed sessions.

**Structure:**

- Screen title “History & Analytics”.
- Two-option native segmented control: Workouts and Analytics.
- Workouts label includes completed session count.
- Newest sessions first.
- Each row identifies planned vs unplanned workout, date, and notes or “View details”.

**Empty state:**

- “No completed workouts”.
- Explain that finished workouts appear here and can be repeated in one tap.

### 4.11 Workout detail

**Purpose:** Review exactly what was completed and repeat it if useful.

**Content:**

- Back to history.
- Planned or unplanned workout title and local date/time.
- Summary: set count, volume, and duration.
- Exercise groups in workout order.
- Each set shows set number, weight × reps or duration, and RPE/completion.
- Optional notes section.

**Actions:**

- Primary: “Repeat this workout”, creating an editable active session.
- Destructive: “Delete workout”, separated and confirmed.
- Show error feedback if duplication fails.

### 4.12 History — analytics tab

**Purpose:** Show useful long-term trends without becoming a dense dashboard.

**Charts:**

- Body-weight trend using the most recent measurements.
- Exercise estimated-one-rep-max trend derived from completed weighted sets.
- Horizontal exercise chips choose the strength trend.
- Charts include readable labels, values, units, and non-color cues.

**Body check-in:**

- Weight in the selected unit is required.
- Body-fat percentage is optional and valid from 1% through 75% when present.
- Primary action: “Save check-in”.
- Success: “Body check-in saved.”
- Invalid entry: “Enter a valid weight and body fat between 1% and 75%.”

**Empty state:**

- “Your first trend starts here”.
- Explain that body metrics or completed weighted sets establish a baseline.

### 4.13 Settings

**Purpose:** Configure local training preferences and optional system integrations.

**Training preferences:**

- Native switch: “Use kilograms”; off means pounds.
- Rest timer stepper: decrease/increase in 15-second increments.
- Valid rest range: 15 seconds to 10 minutes.
- Changes save immediately to the local profile.

**Health sync:**

- Explain that only user-approved data is read and retained locally.
- Support states: checking availability, unavailable, available but disconnected, permission needed, connected, syncing, last successful sync, permission denied, and sync error.
- Actions vary by state: Connect, Sync now, Open system settings.
- Providers: Apple Health on iOS and Health Connect on Android.
- Avoid promising background cloud sync.

**Progressive overload:**

- Exercise selector using horizontally scrollable chips.
- Trigger reps input; valid range 1–100.
- Increase-by input in current weight unit; must be positive.
- Primary action: “Save overload rule”.
- Success: “Overload rule saved.”
- Error: “Use 1–100 trigger reps and a positive weight increase.”

**Privacy note:**

- “Health records remain on this device and are only read while Fitness Goal is open.”

## 5. Critical user flows

### Flow A — start and complete an unplanned workout

1. Open Today.
2. Tap “Start an empty workout”.
3. Active Workout opens with no global navigation.
4. Tap “Add first exercise”.
5. Search/filter and select an exercise.
6. Enter weight, reps, and optional RPE.
7. Tap the completion control.
8. Values save, the row becomes complete, and the rest timer starts.
9. Add or duplicate sets as required.
10. Tap Finish, review summary, and confirm.
11. Return to Today; completed data appears in History and performance summaries.

### Flow B — build and run a plan

1. Open Plans and tap “Create workout plan”.
2. Enter plan name and optional description.
3. Choose one or more exercises.
4. Reorder exercises and set target sets/reps.
5. Save the plan.
6. Open plan detail and tap “Start this workout”.
7. The app copies plan targets into editable workout sets.
8. User logs the workout without changing the original plan.

### Flow C — repeat a previous workout

1. From Today, tap “Repeat last workout”, or open a History detail and tap “Repeat this workout”.
2. Create a new active session containing copied exercises, sets, weight, reps, and RPE.
3. Every copied set starts incomplete and remains editable.

### Flow D — review progress

1. Open History and switch to Analytics.
2. Review body-weight trend.
3. Choose an exercise chip to view estimated 1RM history.
4. Add a body check-in.
5. See the chart update immediately from local data.

### Flow E — interrupted workout recovery

1. User leaves or closes the app during a workout.
2. On next launch, the app restores the unfinished local session.
3. Today displays a prominent resume banner, or the app returns to the active session.
4. No network request or recovery workflow is required.

## 6. Component inventory

| Component | Use | Required states |
| --- | --- | --- |
| Primary button | Start, continue, save, confirm | default, pressed, focus, disabled, loading |
| Secondary button | Duplicate, edit, supporting actions | default, pressed, focus, disabled, loading |
| Text button | Back, cancel, finish, destructive actions | default, pressed, focus, destructive, disabled |
| Navigation item | Four app destinations | default, selected, pressed, focus |
| List row | Plans, workouts, exercises, settings | default, pressed, selected, disabled |
| Search field | Exercise search | empty, focused, populated, clearable |
| Filter chip | Muscle, equipment, exercise trends | default, selected, pressed, focus, disabled |
| Numeric input | Weight, reps, RPE, timer rules | empty, focused, populated, invalid, disabled |
| Multiline input | Plan description, workout notes | empty, focused, populated, invalid |
| Set row | High-frequency workout logging | incomplete, editing, invalid, complete |
| Segmented control | Workouts / Analytics | selected, unselected, focused |
| Feedback banner | Local success or recoverable error | success, error, dismissible where useful |
| Empty state | No plans, sessions, exercises, or trends | explanatory copy plus one clear next action |
| Progress chart | Body weight and estimated 1RM | populated, insufficient data, accessibility summary |
| Confirmation dialog | Finish, discard, delete | safe cancel, clear consequence, destructive confirm |
| Health sync panel | System health integration | loading, unavailable, disconnected, connected, syncing, denied, error |
| Rest timer | Between-set recovery | hidden, running, adjusted, cancelled, completed |

## 7. Data displayed in the UI

### Exercise

- Name.
- Training type.
- Primary muscle group/body part.
- Target and secondary muscles when useful.
- Equipment.
- Instructions and optional media are available in the data model but are not yet a required detail screen.
- Custom exercise flag exists in the data model; custom-exercise creation is not in the current UI scope.

### Workout plan

- Name and description.
- Ordered exercises.
- Target sets and target repetitions per exercise.
- Created and updated timestamps for ordering/sync readiness.

### Workout session

- Planned or unplanned origin.
- Start and end time.
- Notes.
- Ordered exercise groups and sets.
- Derived duration, completed-set count, and total volume.

### Workout set

- Set number and order.
- Weight.
- Repetitions.
- Duration in seconds for timed work.
- RPE.
- Completion state.
- Derived estimated 1RM for weighted sets.

### Body metric

- Date.
- Body weight.
- Optional body-fat percentage.

## 8. Visual design direction

### Physical scene

The user is standing beside a rack under mixed gym lighting, breathing hard, holding a phone in one hand, and needs to record the next set in a few seconds without second-guessing the interface.

### Color strategy

Use a restrained neutral product foundation with one primary interaction color. Performance colors appear only where they encode meaning.

| Semantic role | Light | Dark | Usage |
| --- | --- | --- | --- |
| Canvas | `#FFFFFF` | `#070A10` | App background |
| Surface | `#F2F3F5` | `#151A22` | Grouped controls, list sections |
| Raised surface | `#FFFFFF` | `#1D232D` | Selected segments, elevated task layer |
| Ink | `#101114` | `#F7F9FC` | Primary text |
| Muted | `#62666D` | `#AAB1BC` | Secondary text |
| Outline | `#DFE1E5` | `#343D4B` | Dividers and boundaries |
| Primary | `#087E6C` | `#94E8D1` | Primary actions and selection |
| Coral | `#D72D4C` | `#FF3858` | Set/progress role |
| Lime | `#237A3C` | `#38D16A` | Consistency/session role |
| Cyan | `#096FBD` | `#1689F8` | Volume/trend role |
| Recovery | `#7B3AB5` | `#B45CF2` | Rest and recovery role |
| Success | `#167C4D` | `#5DD895` | Completed state |
| Warning | `#9B5A00` | `#F3C558` | Caution |
| Danger | `#C82D48` | `#FF5C73` | Errors/destructive actions |

Use semantic roles in implementation; platform colors may be adapted to preserve contrast and native behavior. Primary filled controls always use the paired on-primary text color.

### Typography

- Use San Francisco on iOS and Roboto on Android; system UI stack for responsive web previews.
- Use platform text styles so system font scaling works.
- Use bold, decisive screen titles without marketing-sized display text.
- Use tabular numerals for timer, weight, reps, RPE, volume, duration, and chart values.
- Keep labels compact but never below the platform readability floor.

### Shape, spacing, and elevation

- Base spacing unit: 4.
- Common page horizontal padding: approximately 20.
- Surface radius: 12–16.
- Pills only for filters, compact statuses, and timer-related controls.
- Prefer dividers and grouped lists to stacks of separate cards.
- Use tonal surface differences; avoid wide decorative shadows.
- Minimum touch targets: 44 × 44 pt iOS, 48 × 48 dp Android.

### Iconography and imagery

- Use one consistent rounded-stroke icon family.
- Selected navigation may use a filled variant; inactive icons remain restrained.
- Exercise artwork uses precise single-color fitness silhouettes grouped by movement family.
- The multi-color luminous treatment is reserved for the Fitness Goal core brand mark.
- Do not mix unrelated icon sets or use cartoon illustrations.

### Motion

- Most transitions: 150–250 ms with native easing.
- Animate state changes such as set completion, set insertion, filter selection, and timer start.
- Use native navigation transitions rather than custom page choreography.
- Reduced-motion mode uses crossfade or an instant state change.
- No decorative page-load animations.

## 9. Responsive and platform behavior

### Compact phones

- Bottom navigation with four destinations.
- Single-column content.
- Set table must fit without horizontal page scrolling; keep labels terse.
- Keep workout actions above the home indicator, navigation bar, and keyboard.
- Horizontally scroll filter chips while keeping list content vertical.

### Large phones and tablets

- Use additional width for breathing room, not oversized type.
- Move global navigation to a left rail at expanded widths.
- Allow analytics charts and body-check-in controls to sit in a balanced two-column region where space permits.
- Keep the Active Workout’s next incomplete exercise visually dominant.

### iOS conventions

- Safe-area layout, native sheets/alerts, Dynamic Type, edge-swipe back.
- System segmented controls, switches, pickers, and context menus where practical.
- Large titles on top-level destinations; inline titles on details.

### Android conventions

- Edge-to-edge layout with status, navigation, cutout, and keyboard insets.
- Material 3 navigation bar on compact widths and navigation rail on expanded widths.
- Honor system and predictive Back.
- Use Material buttons, switches, chips, snackbars, bottom sheets, and dialogs.

## 10. Accessibility requirements

- Body text contrast at least 4.5:1; large text and meaningful graphical boundaries at least 3:1.
- Do not communicate completion, selection, chart series, or errors through color alone.
- Every icon-only control has a specific accessible name, such as “Move Bench Press up”.
- Set-completion controls expose checkbox role and checked state.
- Charts provide a concise spoken summary and access to individual values.
- Support system font scaling without clipped headings, labels, or buttons.
- Preserve logical screen-reader and keyboard focus order.
- Announce validation and save errors near the relevant control.
- Respect reduced motion and increased contrast settings.
- All destructive actions require clear wording and a safe cancel option.

## 11. Content and UX writing

### Voice

- Direct, calm, and useful.
- Encouraging without cheerleading.
- Specific about what happened and whether data is safe.
- Avoid gym-bro language, guilt, streak pressure, and vague motivational slogans.

### Button style

Use verb-first labels: “Start an empty workout”, “Add exercise”, “Save check-in”, “Repeat this workout”. Avoid generic labels such as “Submit”, “Continue” when a more specific action is available, or icon-only primary actions.

### Feedback examples

- “Workout plan saved.”
- “Plan duplicated.”
- “Set 3 marked incomplete.”
- “Body check-in saved.”
- “The workout could not be started. Your saved data is unchanged.”

### Confirmation pattern

- Title names the action: “Discard this workout?”
- Supporting copy states the consequence: “This removes the session and all of its sets from this device.”
- Actions are explicit: “Cancel” and “Discard”.

## 12. Relume generation checklist

The generated concept is acceptable only if it satisfies all of the following:

- It looks like a task-focused app, not a fitness marketing website.
- Today, Plans, History, and Settings are the only global destinations.
- Active Workout hides global navigation.
- Set logging is inline and does not require opening a modal for every set.
- Previous-set context appears beside the current logging task.
- Empty, loading, disabled, validation, error, and success states are included.
- Offline use is presented as normal.
- Realistic fitness content replaces lorem ipsum.
- Lists and dividers are used more often than card grids.
- Light and dark appearances are both represented.
- Phone and expanded-width navigation patterns are shown.
- Touch targets, safe areas, keyboard behavior, system back, and font scaling are accounted for.
- No social, subscription, nutrition, AI-coach, or cloud-account features are invented.

## 13. Suggested wireframe deliverables

Ask Relume to generate these frames in both light and dark appearance where marked:

1. Today — populated, light.
2. Today — active workout resume and disabled start actions, dark.
3. Today — new-user/empty state.
4. Active Workout — populated and rest timer running, light and dark.
5. Active Workout — empty.
6. Exercise Picker — search results, filters, and selected state.
7. Exercise Picker — no results.
8. Plans — populated and empty.
9. Plan Builder — all three steps with validation examples.
10. Plan Detail and Edit Plan.
11. History — workouts list and empty state.
12. Workout Detail with notes.
13. Analytics — populated and empty, including body check-in validation.
14. Settings — connected health state.
15. Settings — unavailable/permission-denied health states.
16. Local preparation and recoverable error.
17. Expanded tablet layout with left navigation rail.
18. Finish, discard, and delete confirmation dialogs.

