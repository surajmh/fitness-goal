import type { WorkoutPlan, WorkoutSession, WorkoutSet } from '@fitnessgoal/data-access/workout';

export type TodayScreenProps = {
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
  activeSessions: WorkoutSession[];
};

export type TodaySummary = {
  completedSetCount: number;
  volume: number;
  weekBars: number[];
  maxBar: number;
};
