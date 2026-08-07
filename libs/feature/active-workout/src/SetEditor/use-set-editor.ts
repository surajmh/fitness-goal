import { useState } from 'react';
import type { WorkoutSet } from '@fitnessgoal/data-access/workout';
import { updateSet } from '@fitnessgoal/data-access/workout';
import { parseSetValues, validateSetValues } from './set-editor.helpers';

export function useSetEditor(item: WorkoutSet) {
  const [weight, setWeight] = useState(item.weight?.toString() ?? '');
  const [reps, setReps] = useState(item.reps?.toString() ?? '');
  const [rpe, setRpe] = useState(item.rpe?.toString() ?? '');
  const [error, setError] = useState('');

  const save = async () => {
    const values = parseSetValues({ weight, reps, rpe });
    if (!validateSetValues(values)) {
      setError('Check weight, reps, and RPE (1–10).');
      return false;
    }
    setError('');
    await updateSet(item, values);
    return true;
  };

  return { weight, setWeight, reps, setReps, rpe, setRpe, error, save };
}
