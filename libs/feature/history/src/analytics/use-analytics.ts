import { useState } from 'react';
import {
  BodyMetric,
  database,
  type Exercise,
  type WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import { USER_ID } from '@fitnessgoal/shared/ui';
import {
  getExerciseProgress,
  parseBodyMetric,
} from './analytics.helpers';

export function useAnalytics(sets: WorkoutSet[], exercises: Exercise[]) {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [feedback, setFeedback] = useState('');
  const [metricError, setMetricError] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const progress = getExerciseProgress(sets, exercises, selectedExerciseId);

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
    ...progress,
  };
}
