import { useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';
import type {
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import {
  buildWeeklyVolume,
  formatHistorySpan,
  getSessionSummary,
  groupSessionsByWeek,
  summarizeSessions,
} from './history-screen.helpers';

export function useHistoryScreen(
  sessions: WorkoutSession[],
  sets: WorkoutSet[],
) {
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

  const weeklyVolume = useMemo(() => buildWeeklyVolume(sets), [sets]);

  return {
    selected,
    setSelected,
    summary: selected ? getSessionSummary(sets, selected.id) : null,
    span: formatHistorySpan(sessions),
    weeklyVolume,
    maxVolume: Math.max(1, ...weeklyVolume),
    groups: useMemo(() => groupSessionsByWeek(sessions), [sessions]),
    totals: useMemo(() => summarizeSessions(sets), [sets]),
  };
}
