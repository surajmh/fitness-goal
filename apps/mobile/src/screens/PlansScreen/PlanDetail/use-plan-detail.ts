import { useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import type { UsePlanDetailOptions } from './plan-detail.types';

type PlanAction = 'delete' | 'duplicate' | 'save' | 'start' | null;

export function usePlanDetail({
  onBack,
  onDelete,
  onDuplicate,
  onStart,
  onUpdate,
  plan,
}: UsePlanDetailOptions) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(plan.name);
  const [nameTouched, setNameTouched] = useState(false);
  const [description, setDescription] = useState(plan.description);
  const [action, setAction] = useState<PlanAction>(null);
  const [error, setError] = useState('');

  const cancelEditing = () => {
    setName(plan.name);
    setDescription(plan.description);
    setNameTouched(false);
    setEditing(false);
    setError('');
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (editing) cancelEditing();
        else onBack();
        return true;
      },
    );
    return () => subscription.remove();
  });

  const run = async (
    nextAction: Exclude<PlanAction, null | 'delete'>,
    callback: () => Promise<void>,
    failureMessage: string,
  ) => {
    try {
      setError('');
      setAction(nextAction);
      await callback();
    } catch {
      setError(failureMessage);
    } finally {
      setAction(null);
    }
  };

  const save = () =>
    run(
      'save',
      async () => {
        await onUpdate({
          name: name.trim(),
          description: description.trim(),
        });
        setEditing(false);
      },
      'The plan could not be updated. Try again.',
    );

  const confirmDelete = () =>
    Alert.alert(
      'Delete plan?',
      'Completed workout history will not be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setError('');
              setAction('delete');
              await onDelete();
            } catch {
              setError('The plan could not be deleted. Try again.');
            } finally {
              setAction(null);
            }
          },
        },
      ],
    );

  return {
    action,
    beginEditing: () => {
      setName(plan.name);
      setDescription(plan.description);
      setNameTouched(false);
      setEditing(true);
      setError('');
    },
    cancelEditing,
    confirmDelete,
    description,
    editing,
    error,
    name,
    nameTouched,
    save,
    setDescription,
    setName,
    setNameTouched,
    start: () =>
      run('start', onStart, 'The workout could not be started. Try again.'),
    duplicate: () =>
      run(
        'duplicate',
        onDuplicate,
        'The plan could not be duplicated. Try again.',
      ),
  };
}
