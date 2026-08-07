import { useEffect, useState } from 'react';
import { database, OverloadSetting } from '../../database';
import type { SettingsScreenProps } from './settings-screen.types';
import { parseOverloadInput } from './settings-screen.helpers';
import { USER_ID } from '../shared/screen-shared';

export function useSettingsScreen({
  exercises,
  overloadSettings,
}: SettingsScreenProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    exercises[0]?.id ?? '',
  );
  const [triggerReps, setTriggerReps] = useState('12');
  const [increaseBy, setIncreaseBy] = useState('5');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const selectedSetting = overloadSettings.find(
    (item) => item.exerciseId === selectedExerciseId,
  );

  useEffect(() => {
    setTriggerReps(String(selectedSetting?.triggerReps ?? 12));
    setIncreaseBy(String(selectedSetting?.increaseWeightBy ?? 5));
  }, [selectedSetting]);

  const saveOverload = async () => {
    if (!selectedExerciseId) return;
    const input = parseOverloadInput({ triggerReps, increaseBy });
    if (!input.valid) {
      setError('Use 1–100 trigger reps and a positive weight increase.');
      return;
    }
    await database.write(async () => {
      if (selectedSetting) {
        await selectedSetting.update((record) => {
          record.triggerReps = input.triggerReps;
          record.increaseWeightBy = input.increaseBy;
        });
      } else {
        await database
          .get<OverloadSetting>('overload_settings')
          .create((record) => {
            record.userId = USER_ID;
            record.exerciseId = selectedExerciseId;
            record.triggerReps = input.triggerReps;
            record.increaseWeightBy = input.increaseBy;
          });
      }
    });
    setError('');
    setFeedback('Overload rule saved.');
  };

  return {
    selectedExerciseId,
    setSelectedExerciseId,
    triggerReps,
    setTriggerReps,
    increaseBy,
    setIncreaseBy,
    feedback,
    error,
    saveOverload,
  };
}
