import type { OverloadInput } from './settings-screen.types';

export function parseOverloadInput(input: OverloadInput) {
  const triggerReps = Number(input.triggerReps);
  const increaseBy = Number(input.increaseBy);
  const valid =
    Number.isInteger(triggerReps) &&
    triggerReps >= 1 &&
    triggerReps <= 100 &&
    Number.isFinite(increaseBy) &&
    increaseBy > 0 &&
    increaseBy <= 500;
  return { triggerReps, increaseBy, valid };
}
