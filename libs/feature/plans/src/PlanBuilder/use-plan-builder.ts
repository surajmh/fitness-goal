import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import {
  hasInvalidTargets,
  moveSelectedExercise,
} from '../plans-screen.helpers';
import type { PlanBuilderStep, PlanTargets } from '../plans-screen.types';
import type { UsePlanBuilderOptions } from './plan-builder.types';

export function usePlanBuilder({ onCancel, onSave }: UsePlanBuilderOptions) {
  const [step, setStep] = useState<PlanBuilderStep>(1);
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [targets, setTargets] = useState<PlanTargets>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const hasDraft = Boolean(
    name.trim() || description.trim() || selectedIds.length,
  );

  const requestCancel = useCallback(() => {
    if (!hasDraft) {
      onCancel();
      return;
    }
    Alert.alert(
      'Discard this plan?',
      'Your plan name, exercise selections, and targets will be lost.',
      [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onCancel },
      ],
    );
  }, [hasDraft, onCancel]);

  const back = useCallback(() => {
    if (step === 1) requestCancel();
    else setStep((current) => (current - 1) as PlanBuilderStep);
  }, [requestCancel, step]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        back();
        return true;
      },
    );
    return () => subscription.remove();
  }, [back]);

  const toggleExercise = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        setTargets((values) => {
          const next = { ...values };
          delete next[id];
          return next;
        });
        return current.filter((item) => item !== id);
      }
      setTargets((values) => ({
        ...values,
        [id]: { sets: '3', reps: '8' },
      }));
      return [...current, id];
    });
  };

  const save = async () => {
    if (!name.trim() || hasInvalidTargets(selectedIds, targets)) return;
    try {
      setError('');
      setSaving(true);
      await onSave({
        name: name.trim(),
        description: description.trim(),
        exercises: selectedIds.map((exerciseId) => ({
          exerciseId,
          targetSets: Number(targets[exerciseId]?.sets),
          targetReps: Number(targets[exerciseId]?.reps),
        })),
      });
    } catch {
      setError('The workout plan could not be saved. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return {
    back,
    description,
    error,
    moveExercise: (index: number, direction: -1 | 1) =>
      setSelectedIds((ids) => moveSelectedExercise(ids, index, direction)),
    name,
    nameTouched,
    next: () => {
      if (step === 1) {
        setNameTouched(true);
        if (!name.trim()) return;
      }
      setStep((current) => Math.min(3, current + 1) as PlanBuilderStep);
    },
    requestCancel,
    save,
    saving,
    selectedIds,
    setDescription,
    setName,
    setNameTouched,
    setTarget: (id: string, key: 'reps' | 'sets', value: string) =>
      setTargets((current) => ({
        ...current,
        [id]: { ...(current[id] ?? { sets: '3', reps: '8' }), [key]: value },
      })),
    step,
    targets,
    toggleExercise,
  };
}
