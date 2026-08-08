import type {
  PlanExercise,
  WorkoutPlan,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import type { TodaySummary, UpNextPlan } from './today-screen.types';

const WEEK_MS = 7 * 86_400_000;

export function buildTodaySummary(
  sessions: WorkoutSession[],
  sets: WorkoutSet[],
  now = new Date(),
): TodaySummary {
  const weekStart = now.getTime() - WEEK_MS;
  const weekSets = sets.filter(
    (item) => item.isCompleted && item.createdAt.getTime() >= weekStart,
  );

  return {
    weekVolume: weekSets.reduce(
      (total, item) => total + (item.weight ?? 0) * (item.reps ?? 0),
      0,
    ),
    weekSessions: sessions.filter((item) => item.startTime >= weekStart).length,
    streakWeeks: countStreakWeeks(sessions, now),
  };
}

/**
 * Consecutive seven-day windows back from now that contain at least one
 * session. The current window is still in progress, so an empty one doesn't
 * break the streak — it just hasn't been trained into yet.
 */
export function countStreakWeeks(sessions: WorkoutSession[], now = new Date()) {
  const startTimes = sessions.map((item) => item.startTime);
  const hasSession = (weeksBack: number) => {
    const end = now.getTime() - weeksBack * WEEK_MS;
    return startTimes.some((time) => time > end - WEEK_MS && time <= end);
  };

  let weeksBack = hasSession(0) ? 0 : 1;
  let streak = 0;
  while (hasSession(weeksBack)) {
    streak += 1;
    weeksBack += 1;
  }
  return streak;
}

/** How much work a plan holds: its exercises and their target sets. */
export function countPlanWork(planExercises: PlanExercise[], planId: string) {
  const entries = planExercises.filter((item) => item.planId === planId);
  return {
    exerciseCount: entries.length,
    setCount: entries.reduce((total, item) => total + item.targetSets, 0),
  };
}

export function buildUpNext(
  plans: WorkoutPlan[],
  planExercises: PlanExercise[],
  sessions: WorkoutSession[],
): UpNextPlan | undefined {
  const plan = plans[0];
  if (!plan) return undefined;

  return {
    plan,
    ...countPlanWork(planExercises, plan.id),
    lastDoneAt: sessions.find((item) => item.planId === plan.id)?.startTime,
  };
}

/** "PB" for "Pull B — Back & Biceps", "FU" for "Full body". */
export function planInitials(name: string) {
  const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (!words.length) return '··';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function formatRelativeDay(timestamp: number, now = new Date()) {
  const days = Math.floor((now.getTime() - timestamp) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
}
