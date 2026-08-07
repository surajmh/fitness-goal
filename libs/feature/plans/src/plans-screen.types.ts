import type { Exercise, PlanExercise, WorkoutPlan } from '@fitnessgoal/data-access/workout';

export type PlansScreenProps = {
  plans: WorkoutPlan[];
  planExercises: PlanExercise[];
  exercises: Exercise[];
};

export type PlanTarget = { sets: string; reps: string };
export type PlanTargets = Record<string, PlanTarget>;
export type PlanBuilderStep = 1 | 2 | 3;

export type CreatePlanInput = {
  name: string;
  description: string;
  exercises: Array<{
    exerciseId: string;
    targetSets: number;
    targetReps: number;
  }>;
};
