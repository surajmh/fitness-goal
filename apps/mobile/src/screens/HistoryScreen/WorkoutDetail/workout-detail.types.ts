import type { Exercise, WorkoutSession } from '../../../database';
import type { HistorySessionSummary } from '../history-screen.types';

export type WorkoutDetailProps = {
  exercises: Exercise[];
  onBack: () => void;
  onDelete: () => Promise<void>;
  onRepeat: () => Promise<void>;
  session: WorkoutSession;
  summary: HistorySessionSummary;
  weightUnit: 'lb' | 'kg';
};

export type UseWorkoutDetailOptions = Pick<
  WorkoutDetailProps,
  'onDelete' | 'onRepeat'
>;
