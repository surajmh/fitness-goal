import { useMemo, useState } from 'react';
import {
  BodyMetric,
  database,
  type Exercise,
  type HealthRecord,
  WEEKLY_SESSION_GOAL,
  type WorkoutSession,
  type WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import { USER_ID } from '@fitnessgoal/shared/ui';
import { buildWeeklyVolume } from '../history-screen.helpers';
import {
  ANALYTICS_RANGES,
  type AnalyticsRangeKey,
  averageSleepHours,
  calculateConsistency,
  getExerciseProgress,
  parseBodyMetric,
} from './analytics.helpers';

const WEEK_MS = 7 * 86_400_000;

export function useAnalytics(
  sets: WorkoutSet[],
  exercises: Exercise[],
  sessions: WorkoutSession[],
  sleepRecords: HealthRecord[],
) {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [feedback, setFeedback] = useState('');
  const [metricError, setMetricError] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [range, setRange] = useState<AnalyticsRangeKey>('8wk');

  const days =
    ANALYTICS_RANGES.find((item) => item.key === range)?.days ?? Infinity;
  const since = Number.isFinite(days) ? Date.now() - days * 86_400_000 : 0;
  const rangeSets = useMemo(
    () => sets.filter((item) => item.createdAt.getTime() >= since),
    [sets, since],
  );
  // One bucket per week the log actually covers, so "All" widens with the data
  // instead of quietly drawing the same six months as "6 mo". `sets` arrives
  // oldest-first from the query, so the first one bounds the range.
  const oldest = rangeSets[0]?.createdAt.getTime() ?? Date.now();
  const weekCount = Math.min(
    52,
    Math.max(8, Math.ceil((Date.now() - oldest) / WEEK_MS)),
  );
  const progress = getExerciseProgress(
    rangeSets,
    exercises,
    selectedExerciseId,
  );

  const addMetric = async () => {
    const input = parseBodyMetric({ weight, bodyFat });
    if (!input.valid) {
      setMetricError('Enter a valid weight and body fat between 1% and 75%.');
      return;
    }
    try {
      await database.write(async () => {
        await database.get<BodyMetric>('body_metrics').create((record) => {
          record.userId = USER_ID;
          record.date = Date.now();
          record.bodyWeight = input.weight;
          record.bodyFatPercentage = input.bodyFat;
        });
      });
      setWeight('');
      setBodyFat('');
      setMetricError('');
      setFeedback('Body check-in saved.');
    } catch {
      setMetricError('The check-in could not be saved. Try again.');
    }
  };

  return {
    weight,
    setWeight,
    bodyFat,
    setBodyFat,
    feedback,
    metricError,
    selectedExerciseId,
    setSelectedExerciseId,
    addMetric,
    range,
    setRange,
    weeklyVolume: useMemo(
      () => buildWeeklyVolume(rangeSets, weekCount),
      [rangeSets, weekCount],
    ),
    consistency: calculateConsistency(sessions, since, WEEKLY_SESSION_GOAL),
    sleepHours: averageSleepHours(sleepRecords, since),
    ...progress,
  };
}
