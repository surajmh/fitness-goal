import { useEffect, useMemo, useState } from 'react';
import { database, OverloadSetting } from '@fitnessgoal/data-access/workout';
import type { SettingsScreenProps } from './settings-screen.types';
import { parseOverloadInput } from './settings-screen.helpers';
import { USER_ID } from '@fitnessgoal/shared/ui';

export function useSettingsScreen({
  exercises,
  overloadSettings,
}: SettingsScreenProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    exercises[0]?.id ?? '',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerReps, setTriggerReps] = useState('12');
  const [increaseBy, setIncreaseBy] = useState('5');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const overloadMap = useMemo(() => {
    const map = new Map<string, OverloadSetting>();
    overloadSettings.forEach((item) => {
      map.set(item.exerciseId, item);
    });
    return map;
  }, [overloadSettings]);

  const configuredRules = useMemo(() => {
    return overloadSettings
      .map((setting) => {
        const exercise = exercises.find((ex) => ex.id === setting.exerciseId);
        if (!exercise) return null;
        return {
          setting,
          exercise,
          triggerReps: setting.triggerReps,
          increaseBy: setting.increaseWeightBy,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [overloadSettings, exercises]);

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const q = searchQuery.toLowerCase().trim();
    return exercises.filter((ex) => ex.name.toLowerCase().includes(q));
  }, [exercises, searchQuery]);

  const selectedSetting = overloadMap.get(selectedExerciseId);
  const selectedExercise = useMemo(
    () => exercises.find((ex) => ex.id === selectedExerciseId),
    [exercises, selectedExerciseId],
  );

  useEffect(() => {
    if (!selectedExerciseId && exercises.length > 0) {
      setSelectedExerciseId(exercises[0].id);
    }
  }, [exercises, selectedExerciseId]);

  useEffect(() => {
    setTriggerReps(String(selectedSetting?.triggerReps ?? 12));
    setIncreaseBy(String(selectedSetting?.increaseWeightBy ?? 5));
  }, [selectedSetting, selectedExerciseId]);

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
    const exName = selectedExercise?.name ?? 'Exercise';
    setFeedback(`Saved overload rule for ${exName}.`);
  };

  const deleteOverload = async (exerciseId: string) => {
    const settingToDelete = overloadMap.get(exerciseId);
    if (!settingToDelete) return;
    const ex = exercises.find((e) => e.id === exerciseId);
    await database.write(async () => {
      await settingToDelete.destroyPermanently();
    });
    setError('');
    setFeedback(`Removed custom overload rule for ${ex?.name ?? 'exercise'}.`);
  };

  const handleStepReps = (delta: number) => {
    const current = Number(triggerReps) || 12;
    const next = Math.max(1, Math.min(100, current + delta));
    setTriggerReps(String(next));
  };

  const handleStepIncrease = (delta: number) => {
    const current = Number(increaseBy) || 5;
    const next = Math.max(
      0.5,
      Math.min(500, Math.round((current + delta) * 10) / 10),
    );
    setIncreaseBy(String(next));
  };

  return {
    selectedExerciseId,
    setSelectedExerciseId,
    selectedExercise,
    searchQuery,
    setSearchQuery,
    filteredExercises,
    overloadMap,
    configuredRules,
    triggerReps,
    setTriggerReps,
    increaseBy,
    setIncreaseBy,
    feedback,
    error,
    saveOverload,
    deleteOverload,
    handleStepReps,
    handleStepIncrease,
  };
}
