import { useState } from 'react';
import { Alert } from 'react-native';
import type { UseWorkoutDetailOptions } from './workout-detail.types';

export function useWorkoutDetail({
  onDelete,
  onRepeat,
}: UseWorkoutDetailOptions) {
  const [error, setError] = useState('');
  const [repeating, setRepeating] = useState(false);

  const repeat = async () => {
    try {
      setError('');
      setRepeating(true);
      await onRepeat();
    } catch {
      setError('The workout could not be repeated. Try again.');
    } finally {
      setRepeating(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert(
      'Delete this workout?',
      'This permanently removes the workout and all of its sets from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setError('');
              await onDelete();
            } catch {
              setError('The workout could not be deleted. Try again.');
            }
          },
        },
      ],
    );

  return { confirmDelete, error, repeat, repeating };
}
