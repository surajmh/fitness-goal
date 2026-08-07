import type { WorkoutSet } from '@fitnessgoal/data-access/workout';

export type SetEditorProps = {
  item: WorkoutSet;
  unit: string;
  onCompleted: () => void;
  previous?: WorkoutSet;
  onDuplicate: () => void;
  onRemove: () => void;
};

export type SetValues = { weight: string; reps: string; rpe: string };
export type ParsedSetValues = { weight?: number; reps?: number; rpe?: number };
