import type {
  PlanDifficulty,
  PlanExercise,
  WorkoutPlan,
} from '@fitnessgoal/data-access/workout';
import type { PlanGroup, PlanTargets } from './plans-screen.types';

/**
 * Levels in the order the Plans screen lists them. Kept in this type-only
 * module so the builder and detail views — both unit-tested as plain
 * functions — never pull the database barrel in for a label.
 */
export const PLAN_DIFFICULTIES: ReadonlyArray<{
  key: PlanDifficulty;
  label: string;
}> = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

/**
 * Plans under their difficulty heading. Anything without one — a plan built
 * before the field existed — falls into a final group rather than being
 * guessed into one of the three.
 */
export function groupPlansByDifficulty(plans: WorkoutPlan[]): PlanGroup[] {
  const groups: PlanGroup[] = PLAN_DIFFICULTIES.map(({ key, label }) => ({
    label,
    plans: plans.filter((plan) => plan.difficulty === key),
  }));
  const keys = new Set<string>(PLAN_DIFFICULTIES.map((level) => level.key));
  groups.push({
    label: 'My plans',
    plans: plans.filter((plan) => !keys.has(plan.difficulty)),
  });
  return groups.filter((group) => group.plans.length > 0);
}

export function countPlanSets(planExercises: PlanExercise[], planId: string) {
  return planExercises
    .filter((entry) => entry.planId === planId)
    .reduce((total, entry) => total + entry.targetSets, 0);
}

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
