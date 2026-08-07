import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import type { WorkoutSession, WorkoutSet } from '@fitnessgoal/data-access/workout';
import { getSessionSummary } from './history-screen.helpers';

export function useHistoryScreen(sets: WorkoutSet[]) {
  const [selected, setSelected] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    if (!selected) return;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setSelected(null);
        return true;
      },
    );
    return () => subscription.remove();
  }, [selected]);

  return {
    selected,
    setSelected,
    summary: selected ? getSessionSummary(sets, selected.id) : null,
  };
}
