import type {
  Exercise,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';

export type ActiveWorkoutScreenProps = {
  session: WorkoutSession;
  sets: WorkoutSet[];
  exercises: Exercise[];
  historySets: WorkoutSet[];
};

export type WorkoutSetGroup = [exerciseId: string, sets: WorkoutSet[]];
