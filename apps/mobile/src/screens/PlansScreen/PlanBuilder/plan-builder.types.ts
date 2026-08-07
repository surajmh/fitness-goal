import type { Exercise } from '../../../database';
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
