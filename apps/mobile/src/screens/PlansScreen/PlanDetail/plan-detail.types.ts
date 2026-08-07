import type { Exercise, PlanExercise, WorkoutPlan } from '../../../database';

export type PlanMetadata = { name: string; description: string };

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
