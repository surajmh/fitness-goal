import type {
  BodyMetric,
  Exercise,
  HealthRecord,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';

export type HistoryScreenProps = {
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
  exercises: Exercise[];
  metrics: BodyMetric[];
  sleepRecords: HealthRecord[];
};

export type SessionWeekGroup = {
  label: string;
  sessions: WorkoutSession[];
};

export type SessionTotals = { volume: number; setCount: number };

export type HistorySessionSummary = {
  sessionSets: WorkoutSet[];
  grouped: Record<string, WorkoutSet[]>;
  volume: number;
};
