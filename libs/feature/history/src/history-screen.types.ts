import type { BodyMetric, Exercise, WorkoutSession, WorkoutSet } from '@fitnessgoal/data-access/workout';

export type HistoryScreenProps = {
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
  exercises: Exercise[];
  metrics: BodyMetric[];
};

export type HistorySessionSummary = {
  sessionSets: WorkoutSet[];
  grouped: Record<string, WorkoutSet[]>;
  volume: number;
};
