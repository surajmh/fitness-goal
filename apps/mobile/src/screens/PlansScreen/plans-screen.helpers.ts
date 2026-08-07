import type { PlanTargets } from './plans-screen.types';

export function moveSelectedExercise(
  ids: string[],
  index: number,
  direction: -1 | 1,
) {
  const target = index + direction;
  if (target < 0 || target >= ids.length) return ids;
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function hasInvalidTargets(ids: string[], targets: PlanTargets) {
  return ids.some((id) => {
    const value = targets[id];
    const sets = Number(value?.sets);
    const reps = Number(value?.reps);
    return (
      !value ||
      !Number.isFinite(sets) ||
      !Number.isFinite(reps) ||
      sets < 1 ||
      reps < 1
    );
  });
}
