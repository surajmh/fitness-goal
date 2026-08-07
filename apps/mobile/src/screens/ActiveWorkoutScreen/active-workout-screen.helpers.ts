import type { WorkoutSet } from '../../database';
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
