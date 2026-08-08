import type { WorkoutSet } from '@fitnessgoal/data-access/workout';
import type { WorkoutSetGroup } from './active-workout-screen.types';

export function groupWorkoutSets(sets: WorkoutSet[]): WorkoutSetGroup[] {
  const grouped = sets.reduce<Record<string, WorkoutSet[]>>((result, item) => {
    (result[item.exerciseId] ??= []).push(item);
    return result;
  }, {});
  return Object.entries(grouped).sort(
    ([, a], [, b]) => (a[0].orderIndex ?? 0) - (b[0].orderIndex ?? 0),
  );
}

/**
 * A completed set is a personal record when its weight beats every completed
 * set of the same exercise before it — earlier sets of this session included,
 * so a ramp-up badges only its top set. An exercise with no history can't set
 * a record: the first time you log something is a baseline, not an
 * achievement, and badging it would light up every set for a new user.
 */
export function findPersonalRecordIds(
  sets: WorkoutSet[],
  historySets: WorkoutSet[],
) {
  const best = new Map<string, number>();
  for (const item of historySets) {
    if (item.weight == null) continue;
    const current = best.get(item.exerciseId);
    if (current == null || item.weight > current)
      best.set(item.exerciseId, item.weight);
  }

  const records = new Set<string>();
  for (const item of sets) {
    if (!item.isCompleted || item.weight == null) continue;
    const previousBest = best.get(item.exerciseId);
    if (previousBest == null) continue;
    if (item.weight > previousBest) {
      records.add(item.id);
      best.set(item.exerciseId, item.weight);
    }
  }
  return records;
}

/** "24:18" under an hour, "1:04:18" past it. */
export function formatElapsed(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  const seconds = (total % 60).toString().padStart(2, '0');
  const minutes = Math.floor(total / 60) % 60;
  const hours = Math.floor(total / 3600);
  if (!hours) return `${minutes}:${seconds}`;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
}

export function summarizeWorkout(sets: WorkoutSet[]) {
  const completedSets = sets.filter((item) => item.isCompleted);
  return {
    completed: completedSets.length,
    volume: completedSets.reduce(
      (total, item) => total + (item.weight ?? 0) * (item.reps ?? 0),
      0,
    ),
    lastCompleted: [...completedSets].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    )[0],
  };
}
