import { useMemo } from 'react';
import type { WorkoutSet } from '@fitnessgoal/data-access/workout';
import {
  groupWorkoutSets,
  summarizeWorkout,
} from './active-workout-screen.helpers';

export function useActiveWorkoutScreen(sets: WorkoutSet[]) {
  const orderedGroups = useMemo(() => groupWorkoutSets(sets), [sets]);
  const summary = useMemo(() => summarizeWorkout(sets), [sets]);
  const activeExerciseId =
    orderedGroups.find(([, exerciseSets]) =>
      exerciseSets.some((set) => !set.isCompleted),
    )?.[0] ?? orderedGroups[0]?.[0];

  return { orderedGroups, activeExerciseId, ...summary };
}
