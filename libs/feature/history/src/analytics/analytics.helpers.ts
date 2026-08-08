import type {
  Exercise,
  HealthRecord,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';

const WEEK_MS = 7 * 86_400_000;

export const ANALYTICS_RANGES = [
  { key: '8wk', label: '8 wk', days: 56 },
  { key: '6mo', label: '6 mo', days: 182 },
  { key: 'all', label: 'All', days: Number.POSITIVE_INFINITY },
] as const;

export type AnalyticsRangeKey = (typeof ANALYTICS_RANGES)[number]['key'];

/**
 * Share of the weekly session goal actually kept, as a percentage. Measured
 * from the first session inside the range rather than the range's own start,
 * so a two-week-old log doesn't score 8% against "All".
 */
export function calculateConsistency(
  sessions: WorkoutSession[],
  since: number,
  goalPerWeek: number,
  now = new Date(),
) {
  const kept = sessions.filter((item) => item.startTime >= since);
  if (!kept.length) return 0;
  const start = Math.min(...kept.map((item) => item.startTime));
  const weeks = Math.max(1, (now.getTime() - start) / WEEK_MS);
  return Math.min(100, Math.round((kept.length / (weeks * goalPerWeek)) * 100));
}

/**
 * Average hours slept per night. Providers report sleep as stage segments, so
 * segments are summed per night before averaging. Undefined when nothing has
 * been synced — an unconnected provider is not a zero-hour night.
 */
export function averageSleepHours(records: HealthRecord[], since: number) {
  const nights = new Map<string, number>();
  for (const record of records) {
    if (record.endTime < since) continue;
    const night = new Date(record.endTime).toDateString();
    const hours = (record.endTime - record.startTime) / 3_600_000;
    nights.set(night, (nights.get(night) ?? 0) + hours);
  }
  if (!nights.size) return undefined;
  const total = [...nights.values()].reduce((sum, value) => sum + value, 0);
  return Math.round((total / nights.size) * 10) / 10;
}

export type BodyMetricInput = {
  weight: string;
  bodyFat?: string;
};

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
