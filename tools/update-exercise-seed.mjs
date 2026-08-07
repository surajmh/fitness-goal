import { writeFile } from 'node:fs/promises';

const DATASET_COMMIT = '7455efae41b330c265e7cd4b78dfa848e7ce5ebd';
const DATASET_URL = `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/${DATASET_COMMIT}/data/exercises.json`;
const OUTPUT_URL = new URL('../apps/mobile/assets/seed.json', import.meta.url);

const response = await fetch(DATASET_URL);
if (!response.ok) {
  throw new Error(
    `Unable to download exercise dataset: ${response.status} ${response.statusText}`,
  );
}

const source = await response.json();
if (!Array.isArray(source) || source.length === 0) {
  throw new Error('Exercise dataset did not contain a non-empty JSON array.');
}

const titleCase = (value) =>
  value.replace(/\b[a-z]/g, (character) => character.toUpperCase());

const compact = source.map((exercise) => ({
  dataset_id: exercise.id,
  name: titleCase(exercise.name),
  type: exercise.body_part === 'cardio' ? 'cardio' : 'strength',
  muscle_group: exercise.category,
  body_part: exercise.body_part,
  equipment: exercise.equipment,
  target: exercise.target,
  secondary_muscles: exercise.secondary_muscles,
  instructions: exercise.instructions.en,
  is_custom: false,
}));

await writeFile(OUTPUT_URL, `${JSON.stringify(compact, null, 2)}\n`);
console.log(
  `Wrote ${compact.length} MIT-licensed exercise records to ${OUTPUT_URL.pathname}`,
);
