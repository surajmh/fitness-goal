import { useEffect, useMemo, useState } from 'react';
import type { WorkoutSet } from '@fitnessgoal/data-access/workout';
import {
  findPersonalRecordIds,
  formatElapsed,
  groupWorkoutSets,
  summarizeWorkout,
} from './active-workout-screen.helpers';

export function useActiveWorkoutScreen(
  sets: WorkoutSet[],
  historySets: WorkoutSet[],
  startTime: number,
) {
  const orderedGroups = useMemo(() => groupWorkoutSets(sets), [sets]);
  const summary = useMemo(() => summarizeWorkout(sets), [sets]);
  const personalRecordIds = useMemo(
    () => findPersonalRecordIds(sets, historySets),
    [sets, historySets],
  );
  const activeExerciseId =
    orderedGroups.find(([, exerciseSets]) =>
      exerciseSets.some((set) => !set.isCompleted),
    )?.[0] ?? orderedGroups[0]?.[0];

  // The set the lifter is on: first incomplete set of the active exercise.
  const activeSetId = orderedGroups
    .find(([exerciseId]) => exerciseId === activeExerciseId)?.[1]
    .find((set) => !set.isCompleted)?.id;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    orderedGroups,
    activeExerciseId,
    activeSetId,
    personalRecordIds,
    elapsed: formatElapsed(now - startTime),
    ...summary,
  };
}
