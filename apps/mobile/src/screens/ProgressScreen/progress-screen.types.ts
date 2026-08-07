import type { BodyMetric, Exercise, WorkoutSet } from '../../database';

export type ProgressScreenProps = {
  metrics: BodyMetric[];
  sets: WorkoutSet[];
  exercises: Exercise[];
};

export type BodyMetricInput = { weight: string; bodyFat: string };
