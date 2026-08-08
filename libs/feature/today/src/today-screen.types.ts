import type {
  PlanExercise,
  WorkoutPlan,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';

export type TodayScreenProps = {
  plans: WorkoutPlan[];
  planExercises: PlanExercise[];
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
  activeSessions: WorkoutSession[];
};

export type TodaySummary = {
  weekVolume: number;
  weekSessions: number;
  streakWeeks: number;
};

export type UpNextPlan = {
  plan: WorkoutPlan;
  exerciseCount: number;
  setCount: number;
  lastDoneAt?: number;
};
