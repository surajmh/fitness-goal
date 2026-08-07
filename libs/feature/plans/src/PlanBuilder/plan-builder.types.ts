import type { Exercise } from '@fitnessgoal/data-access/workout';
import type { CreatePlanInput } from '../plans-screen.types';

export type PlanBuilderProps = {
  exercises: Exercise[];
  onCancel: () => void;
  onSave: (input: CreatePlanInput) => Promise<void>;
};

export type UsePlanBuilderOptions = Pick<
  PlanBuilderProps,
  'onCancel' | 'onSave'
>;
