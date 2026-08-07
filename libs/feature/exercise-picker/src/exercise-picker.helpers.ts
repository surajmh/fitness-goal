import type { Exercise } from '@fitnessgoal/data-access/workout';
import type { ExerciseFilters } from './exercise-picker.types';

export function filterExercises(
  exercises: Exercise[],
  filters: ExerciseFilters,
) {
  const query = filters.query.toLowerCase();
  return exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(query) &&
      (filters.muscle === 'all' || exercise.muscleGroup === filters.muscle) &&
      (filters.equipment === 'all' || exercise.equipment === filters.equipment),
  );
}

export function formatFilterLabel(label: string): string {
  if (!label || label === 'all') return 'All';
  return label
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
