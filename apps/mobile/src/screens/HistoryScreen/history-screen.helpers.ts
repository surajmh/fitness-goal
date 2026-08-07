import type { WorkoutSet } from '../../database';
import type { HistorySessionSummary } from './history-screen.types';

export function getSessionSummary(
  sets: WorkoutSet[],
  sessionId: string,
): HistorySessionSummary {
  const sessionSets = sets.filter((item) => item.sessionId === sessionId);
  const grouped = sessionSets.reduce<Record<string, WorkoutSet[]>>(
    (result, item) => {
      (result[item.exerciseId] ??= []).push(item);
      return result;
    },
    {},
  );
  const volume = sessionSets.reduce(
    (total, item) => total + (item.weight ?? 0) * (item.reps ?? 0),
    0,
  );
  return { sessionSets, grouped, volume };
}

export function formatWorkoutDuration(startTime: number, endTime?: number) {
  if (!endTime || endTime <= startTime) return '—';
  const minutes = Math.max(1, Math.round((endTime - startTime) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

export function formatSetPerformance(
  item: WorkoutSet,
  weightUnit: 'lb' | 'kg',
) {
  if (item.weight != null && item.reps != null)
    return `${item.weight.toLocaleString()} ${weightUnit} × ${item.reps}`;
  if (item.durationSeconds != null) {
    const minutes = Math.floor(item.durationSeconds / 60);
    const seconds = item.durationSeconds % 60;
    return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
  if (item.reps != null) return `${item.reps} reps`;
  if (item.weight != null)
    return `${item.weight.toLocaleString()} ${weightUnit}`;
  return 'No result recorded';
}
