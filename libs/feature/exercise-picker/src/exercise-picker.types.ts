import type { Exercise } from '@fitnessgoal/data-access/workout';

export type ExercisePickerProps = {
  exercises: Exercise[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export type ExerciseFilters = {
  query: string;
  muscle: string;
  equipment: string;
};
