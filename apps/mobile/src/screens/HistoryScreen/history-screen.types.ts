import type { Exercise, WorkoutSession, WorkoutSet } from '../../database';

export type HistoryScreenProps = {
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
  exercises: Exercise[];
};

export type HistorySessionSummary = {
  sessionSets: WorkoutSet[];
  grouped: Record<string, WorkoutSet[]>;
  volume: number;
};
