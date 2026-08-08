import type { WorkoutSet } from '@fitnessgoal/data-access/workout';

export type SetEditorProps = {
  item: WorkoutSet;
  /** The set the lifter is on — lifted onto its own surface, targets grow. */
  isActive?: boolean;
  isPersonalRecord?: boolean;
  unit: string;
  onCompleted: () => void;
  previous?: WorkoutSet;
  onDuplicate: () => void;
  onRemove: () => void;
};

export type SetFieldState = {
  completed: boolean;
  focused: boolean;
  empty: boolean;
};

export type SetValues = { weight: string; reps: string; rpe: string };
export type ParsedSetValues = { weight?: number; reps?: number; rpe?: number };
