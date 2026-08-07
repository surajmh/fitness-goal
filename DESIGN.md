# Fitness Goal Design System

## Intent

GitFit feels like a precise offline training instrument. Light mode uses bright white and cool graphite; dark mode uses a technical blue-black canvas with graphite panels. Mint marks interaction, while four vivid performance roles carry the expressive energy of the supplied project-overview reference. Luminous treatment belongs to the GitFit core mark and key data—not every control.

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

## Typography

Use the platform system family: San Francisco on iOS and Roboto on Android. Primary screen titles are decisive and oversized; supporting labels stay compact to preserve scan speed between sets. Workout values use tabular numerals.

## Shape and Spacing

Use a 4 pt spacing unit with 12–16 pt surface radii. Pills are reserved for filters, timers, and compact status. Controls are at least 48 pt high and expose comfortable one-handed spacing during a session.

## Components

Use platform pressables, text inputs, switches, alerts, and back handling. Shared wrappers supply semantic colors, states, and accessibility. Lists and dividers are preferred over card grids; a surface is elevated only when it represents a distinct task.

Iconography has two coordinated tiers:

- System icons use the app-owned 24 pt SVG family with 1.8 pt rounded strokes, minimal interior detail, and fill only for the current destination or compact play action.
- Fitness figures are precise single-color SVG silhouettes across press, pull, squat, hinge, core, mobility, and cardio movement families. Their color follows the movement role: coral for pressing, lime for lower body, cyan for pulling/cardio, and violet for core, recovery, or mobility.

The GitFit core mark combines the performance rings with a minimal branching circuit/tree. It is the only symbol allowed to use multi-color luminous treatment. Do not mix third-party icon families.

## Motion

Transitions run for 150–250 ms and communicate state: completing a set, inserting a set, changing a filter, or starting a rest timer. The first incomplete exercise receives the only continuous movement preview, using a native-driver transform that reflects its movement family. Reduced-motion mode freezes that preview in its neutral pose.

## Layout

Phone layouts use a five-destination bottom bar attached to the viewport and participating in layout—never an overlay or floating card. At expanded widths the destinations move to a left rail. Active workout controls stay reachable above the home indicator/navigation bar and keyboard.
