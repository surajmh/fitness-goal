import type {
  Exercise,
  PlanDifficulty,
  PlanExercise,
  WorkoutPlan,
  WorkoutSession,
} from '@fitnessgoal/data-access/workout';

export type PlansScreenProps = {
  plans: WorkoutPlan[];
  planExercises: PlanExercise[];
  exercises: Exercise[];
  activeSessions: WorkoutSession[];
};

export type PlanGroup = { label: string; plans: WorkoutPlan[] };

export type PlanTarget = { sets: string; reps: string };
export type PlanTargets = Record<string, PlanTarget>;
export type PlanBuilderStep = 1 | 2 | 3;

export type CreatePlanInput = {
  name: string;
  description: string;
  difficulty: PlanDifficulty;
  exercises: Array<{
    exerciseId: string;
    targetSets: number;
    targetReps: number;
  }>;
};
