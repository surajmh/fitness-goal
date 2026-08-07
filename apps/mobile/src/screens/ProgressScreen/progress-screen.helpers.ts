import type { Exercise, WorkoutSet } from '../../database';
import type { BodyMetricInput } from './progress-screen.types';

export function parseBodyMetric(input: BodyMetricInput) {
  const weight = Number(input.weight);
  const bodyFat = input.bodyFat ? Number(input.bodyFat) : undefined;
  const valid =
    Number.isFinite(weight) &&
    weight > 0 &&
    weight <= 1500 &&
    (bodyFat === undefined ||
      (Number.isFinite(bodyFat) && bodyFat >= 1 && bodyFat <= 75));
  return { weight, bodyFat, valid };
}

export function getExerciseProgress(
  sets: WorkoutSet[],
  exercises: Exercise[],
  selectedExerciseId: string,
) {
  const exerciseIds = [...new Set(sets.map((item) => item.exerciseId))];
  const effectiveExerciseId = exerciseIds.includes(selectedExerciseId)
    ? selectedExerciseId
    : (exerciseIds[0] ?? '');
  const selectedExercise = exercises.find(
    (item) => item.id === effectiveExerciseId,
  );
  const oneRmValues = sets
    .filter(
      (item) =>
        item.exerciseId === effectiveExerciseId &&
        item.isCompleted &&
        item.weight &&
        item.reps,
    )
    .slice(-8)
    .map((item) => estimateOneRepMax(item.weight ?? 0, item.reps ?? 0));
  return { exerciseIds, effectiveExerciseId, selectedExercise, oneRmValues };
}

export const estimateOneRepMax = (weight: number, reps: number) => {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
};
