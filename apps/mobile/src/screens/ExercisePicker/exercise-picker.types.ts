import type { Exercise } from '../../database';

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
