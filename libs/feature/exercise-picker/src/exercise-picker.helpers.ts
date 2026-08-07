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
