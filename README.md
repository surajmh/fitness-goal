# Fitness Goal

An offline-first workout tracker built as an Nx monorepo. The mobile app treats its WatermelonDB database as the source of truth: reads and writes are immediate, work without a network, and carry the timestamps required for a future delta-sync protocol.

## Projects

- `apps/mobile` — Expo / React Native app with NativeWind v5, searchable exercise planning, active set logging, rest notifications, session duplication, progressive-overload foundations, and progress charts.
- `apps/api` — NestJS transport stub exposing the future WatermelonDB-compatible pull/push shape. It deliberately refuses to persist pushed data until authentication and durable backend storage are designed.

## Run locally

WatermelonDB uses native code, so use an Expo development build rather than Expo Go.

```bash
npm install
npx nx prebuild mobile
npx nx run-ios mobile
```

For Android:

```bash
npx nx prebuild mobile
npx nx run-android mobile
```

Run the sync stub:

```bash
npx nx serve api
```

## Validation

```bash
npx nx lint mobile
npx nx test api
npx nx build api
```

## Offline and sync boundaries

- Persistent UI data is queried through WatermelonDB observables.
- UI-only choices use React Context and `useState`; there is no Redux or Zustand.
- Plan execution copies normalized `plan_exercises` into editable `workout_sets` in one local transaction.
- Every table includes `created_at` and `updated_at`.
- The initial profile and 1,324-exercise catalog are prepared and committed through a single `database.batch()` transaction. Existing installs receive an additive, reference-safe upgrade.
- `GET /sync/pull` and `POST /sync/push` reserve the future protocol without coupling the mobile runtime to the API.

Exercise seed provenance is documented in [`apps/mobile/assets/SEED_SOURCES.md`](apps/mobile/assets/SEED_SOURCES.md).
