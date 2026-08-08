# Fitness Goal Design System

## Intent

Fitness Goal feels like a precise offline training instrument. Light mode uses bright white and cool graphite; dark mode uses a technical blue-black canvas with graphite panels. Mint marks interaction, while four vivid performance roles carry the expressive energy of the product reference. Saturated treatment belongs to the core mark and key data—not every control.

## Color

All authored colors resolve through semantic roles.

- Canvas: pure white / near-black
- Surface: cool gray / charcoal
- Ink: near-black / near-white
- Primary: deep teal / luminous mint
- Progress: coral
- Consistency: lime
- Volume: cyan
- Recovery: violet
- Success, warning, and danger remain distinct semantic roles

Primary fills always use the paired `on-primary` token. Light-mode accents are deliberately darker than their dark-mode counterparts to maintain readable contrast.

`brand` is a separate role from `primary`. Brand green (`#0E8F63` light / `#2FD08A` dark) appears only in the core mark, app icon, and splash; `primary` carries every interactive state. Keep them distinct—do not substitute one for the other.

## Typography

Use the platform system family: San Francisco on iOS and Roboto on Android. Primary screen titles are decisive and oversized; supporting labels stay compact to preserve scan speed between sets. Workout values use tabular numerals.

## Shape and Spacing

Use a 4 pt spacing unit with 12–16 pt surface radii. Pills are reserved for filters, timers, and compact status. Controls are at least 48 pt high and expose comfortable one-handed spacing during a session.

## Components

Use platform pressables, text inputs, switches, alerts, and back handling. Shared wrappers supply semantic colors, states, and accessibility. Lists and dividers are preferred over card grids; a surface is elevated only when it represents a distinct task.

Iconography has three coordinated tiers:

- System icons use the app-owned 24 pt SVG family with 1.8 pt rounded strokes, minimal interior detail, and fill only for the current destination or compact play action.
- Exercise photography is the primary movement artwork: public-domain start/end frames, square, cropped to fill, with the same 12–16 pt radii as other surfaces.
- Fitness figures are the fallback for exercises with no photograph—precise single-color SVG silhouettes across press, pull, squat, hinge, core, mobility, and cardio movement families. Their color follows the movement role: coral for pressing, lime for lower body, cyan for pulling/cardio, and violet for core, recovery, or mobility.

The core mark is an upward-trending "M" fused with a "G" that opens onto a bullseye, its tongue aimed at the center: progress meeting a goal. It is drawn in a single brand green on a rounded tile—dark in dark mode, white in light mode—and never in gradients or multiple colors. Do not mix third-party icon families.

## Motion

Transitions run for 150–250 ms and communicate state: completing a set, inserting a set, changing a filter, or starting a rest timer. The first incomplete exercise receives the only continuous movement preview: a cross-fade between the start and end photographs, or—when the exercise has no photography—a native-driver transform of its movement figure. Reduced-motion mode freezes that preview in its neutral pose.

## Layout

Phone layouts use a four-destination bottom bar—Today, Plans, History, Settings—attached to the viewport and participating in layout—never an overlay or floating card. At expanded widths the destinations move to a left rail. Active workout controls stay reachable above the home indicator/navigation bar and keyboard.
