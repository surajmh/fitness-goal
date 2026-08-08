/**
 * Sessions a week the app treats as "on plan". Plans carry no weekly target of
 * their own yet, so Today's session tile and Progress's consistency figure both
 * measure against this.
 */
export const WEEKLY_SESSION_GOAL = 4;

export type PlanDifficulty = 'beginner' | 'intermediate' | 'advanced';

const PLAN_DIFFICULTY_KEYS: PlanDifficulty[] = [
  'beginner',
  'intermediate',
  'advanced',
];

export function isPlanDifficulty(value: string): value is PlanDifficulty {
  return (PLAN_DIFFICULTY_KEYS as string[]).includes(value);
}

/** Seconds of actual work in a set, before the rest interval. */
const SET_WORK_SECONDS = 45;

/**
 * Rough time a plan takes, from its set count and the lifter's own rest
 * setting. Rounded to five minutes so it reads as the estimate it is.
 */
export function estimatePlanMinutes(setCount: number, restSeconds: number) {
  if (!setCount) return 0;
  const minutes = (setCount * (restSeconds + SET_WORK_SECONDS)) / 60;
  return Math.max(5, Math.round(minutes / 5) * 5);
}
