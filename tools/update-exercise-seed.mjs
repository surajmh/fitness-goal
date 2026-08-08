import { writeFile } from 'node:fs/promises';

const DATASET_COMMIT = '7455efae41b330c265e7cd4b78dfa848e7ce5ebd';
const DATASET_URL = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/${DATASET_COMMIT}/data/exercises.json`;

// yuhonas/free-exercise-db is public domain (Unlicense), so its start/end frame
// photos may ship with the app — unlike the upstream Gym Visual GIFs. Frames are
// matched to the primary dataset by normalized name; unmatched exercises fall
// back to the app's own SVG figures.
const MEDIA_COMMIT = 'b0eed061e1c832b3ed815fbaa4b45b3cdc14df49';
const MEDIA_URL = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/${MEDIA_COMMIT}/dist/exercises.json`;
const MEDIA_CDN = `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@${MEDIA_COMMIT}/exercises`;

const OUTPUTS = [
  new URL('../libs/data-access/workout/src/assets/seed.json', import.meta.url),
  new URL('../apps/mobile/assets/seed.json', import.meta.url),
];

const fetchJson = async (url, label) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Unable to download ${label}: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`${label} did not contain a non-empty JSON array.`);
  }
  return data;
};

const tokenize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

const titleCase = (value) =>
  value.replace(/\b[a-z]/g, (character) => character.toUpperCase());

const [source, media] = await Promise.all([
  fetchJson(DATASET_URL, 'exercise dataset'),
  fetchJson(MEDIA_URL, 'exercise media dataset'),
]);

const catalog = media
  .filter((entry) => Array.isArray(entry.images) && entry.images.length)
  .map((entry) => ({
    tokens: tokenize(entry.name),
    frames: entry.images.map((path) => `${MEDIA_CDN}/${path}`),
  }));
const exactByName = new Map(catalog.map((e) => [e.tokens.join(' '), e]));

// Match photos to the primary dataset by name. Exact normalized match first,
// else the closest same-family variant: one name's tokens must fully contain
// the other's, with at most two extra words (e.g. "Barbell Bent Over Row" ->
// "Bent Over Barbell Row"). Illustrative — the exercise's own name and text
// instructions always render alongside.
// ponytail: token-subset heuristic; hand-curate overrides only if a wrong
// movement's photo is reported.
const contains = (inner, outer) => inner.every((t) => outer.includes(t));
const matchFrames = (name) => {
  const tokens = tokenize(name);
  const exact = exactByName.get(tokens.join(' '));
  if (exact) return exact.frames;
  let best = null;
  let bestExtra = 3;
  for (const entry of catalog) {
    const [short, long] =
      tokens.length <= entry.tokens.length
        ? [tokens, entry.tokens]
        : [entry.tokens, tokens];
    if (!contains(short, long)) continue;
    const extra = long.length - short.length;
    if (extra < bestExtra) {
      bestExtra = extra;
      best = entry;
    }
  }
  return best?.frames;
};

// Only exercises with a public-domain media match are seeded; image-less
// records are dropped so the catalog always has artwork to show.
const compact = source.flatMap((exercise) => {
  const name = titleCase(exercise.name);
  const frames = matchFrames(name);
  if (!frames) return [];
  return [
    {
      dataset_id: exercise.id,
      name,
      type: exercise.body_part === 'cardio' ? 'cardio' : 'strength',
      muscle_group: exercise.category,
      body_part: exercise.body_part,
      equipment: exercise.equipment,
      target: exercise.target,
      secondary_muscles: exercise.secondary_muscles,
      instructions: exercise.instructions.en,
      is_custom: false,
      media_frames: frames,
    },
  ];
});

const payload = `${JSON.stringify(compact, null, 2)}\n`;
await Promise.all(OUTPUTS.map((output) => writeFile(output, payload)));
console.log(
  `Wrote ${compact.length} MIT-licensed, image-backed exercise records ` +
    `(of ${source.length} source rows) to ${OUTPUTS.length} seed files.`,
);
