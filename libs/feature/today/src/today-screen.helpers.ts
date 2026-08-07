import type { WorkoutSession, WorkoutSet } from '@fitnessgoal/data-access/workout';
import type { TodaySummary } from './today-screen.types';

export function buildTodaySummary(
  sessions: WorkoutSession[],
  sets: WorkoutSet[],
  now = new Date(),
): TodaySummary {
  const completedSets = sets.filter((item) => item.isCompleted);
  const volume = completedSets.reduce(
    (total, item) => total + (item.weight ?? 0) * (item.reps ?? 0),
    0,
  );
  const weekBars = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - offset));
    return sessions.filter(
      (item) => new Date(item.startTime).toDateString() === date.toDateString(),
    ).length;
  });

  return {
    completedSetCount: completedSets.length,
    volume,
    weekBars,
    maxBar: Math.max(1, ...weekBars),
  };
}
