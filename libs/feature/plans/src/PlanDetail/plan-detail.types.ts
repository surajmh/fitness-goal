import type {
  Exercise,
  PlanDifficulty,
  PlanExercise,
  WorkoutPlan,
} from '@fitnessgoal/data-access/workout';

export type PlanMetadata = {
  name: string;
  description: string;
  difficulty: PlanDifficulty;
};

export type PlanDetailProps = {
  entries: PlanExercise[];
  exercises: Exercise[];
  onBack: () => void;
  onDelete: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onStart: () => Promise<void>;
  onUpdate: (metadata: PlanMetadata) => Promise<void>;
  plan: WorkoutPlan;
};

export type UsePlanDetailOptions = Pick<
  PlanDetailProps,
  'onBack' | 'onDelete' | 'onDuplicate' | 'onStart' | 'onUpdate' | 'plan'
>;
