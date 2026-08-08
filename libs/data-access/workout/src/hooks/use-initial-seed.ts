import { useEffect, useState } from 'react';
import {
  database,
  Exercise,
  PlanExercise,
  User,
  WorkoutPlan,
  WorkoutSet,
} from '../database';
import seed from '../assets/seed.json';
import seedPlans from '../assets/seed-plans.json';
import { isImagelessOrphan } from './use-initial-seed.helpers';

type SeedExercise = {
  dataset_id: string;
  name: string;
  type: string;
  muscle_group: string;
  body_part: string;
  equipment: string;
  target: string;
  secondary_muscles: string[];
  instructions: string;
  media_frames?: string[];
  is_custom: false;
};

type SeedPlan = {
  name: string;
  description: string;
  exercises: Array<{ dataset_id: string; sets: number; reps: number }>;
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export function useInitialSeed() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setError(null);
        const exercises = database.get<Exercise>('exercises');
        const users = database.get<User>('users');
        const [existingExercises, userCount] = await Promise.all([
          exercises.query().fetch(),
          users.query().fetchCount(),
        ]);

        await database.write(async () => {
          const operations = [];
          const existingByDatasetId = new Map(
            existingExercises
              .filter((exercise) => exercise.datasetId)
              .map((exercise) => [exercise.datasetId, exercise]),
          );
          const existingByName = new Map(
            existingExercises
              .filter((exercise) => !exercise.isCustom)
              .map((exercise) => [normalizeName(exercise.name), exercise]),
          );

          operations.push(
            ...(seed as SeedExercise[]).flatMap((item) => {
              const existing =
                existingByDatasetId.get(item.dataset_id) ??
                existingByName.get(normalizeName(item.name));
              const applySeed = (exercise: Exercise) => {
                exercise.name = item.name;
                exercise.type = item.type;
                exercise.muscleGroup = item.muscle_group;
                exercise.bodyPart = item.body_part;
                exercise.equipment = item.equipment;
                exercise.target = item.target;
                exercise.secondaryMusclesJson = JSON.stringify(
                  item.secondary_muscles,
                );
                exercise.instructions = item.instructions;
                exercise.datasetId = item.dataset_id;
                exercise.isCustom = item.is_custom;
                exercise.mediaFramesJson = item.media_frames
                  ? JSON.stringify(item.media_frames)
                  : undefined;
              };

              if (existing) {
                const unchanged =
                  existing.datasetId === item.dataset_id &&
                  existing.name === item.name &&
                  existing.type === item.type &&
                  existing.muscleGroup === item.muscle_group &&
                  existing.bodyPart === item.body_part &&
                  existing.equipment === item.equipment &&
                  existing.target === item.target &&
                  existing.secondaryMusclesJson ===
                    JSON.stringify(item.secondary_muscles) &&
                  existing.instructions === item.instructions &&
                  existing.mediaFramesJson ===
                    (item.media_frames
                      ? JSON.stringify(item.media_frames)
                      : undefined);
                return unchanged ? [] : [existing.prepareUpdate(applySeed)];
              }

              return [
                exercises.prepareCreate((exercise) => {
                  exercise._raw.id = `dataset-${item.dataset_id}`;
                  applySeed(exercise);
                }),
              ];
            }),
          );

          if (userCount === 0) {
            operations.push(
              users.prepareCreate((user) => {
                user._raw.id = 'local-user';
                user.restTimerDefault = 90;
                user.preferredWeightUnit = 'lb';
              }),
            );
          }

          if (operations.length) {
            await database.batch(operations);
          }
        });

        // Drop catalog exercises that have no image, except any still
        // referenced by a plan or a logged workout (deleting those would
        // orphan history).
        const [catalog, planExercises, workoutSets] = await Promise.all([
          exercises.query().fetch(),
          database.get<PlanExercise>('plan_exercises').query().fetch(),
          database.get<WorkoutSet>('workout_sets').query().fetch(),
        ]);
        const referenced = new Set<string>([
          ...planExercises.map((row) => row.exerciseId),
          ...workoutSets.map((row) => row.exerciseId),
        ]);
        const orphans = catalog.filter((exercise) =>
          isImagelessOrphan(exercise, referenced),
        );
        if (orphans.length) {
          await database.write(async () => {
            await database.batch(
              orphans.map((exercise) => exercise.prepareDestroyPermanently()),
            );
          });
        }

        // Starter plans, first run only — never re-create ones the user
        // deleted or edited.
        const plans = database.get<WorkoutPlan>('workout_plans');
        if ((await plans.query().fetchCount()) === 0) {
          const planExerciseCollection =
            database.get<PlanExercise>('plan_exercises');
          await database.write(async () => {
            const records = [];
            for (const item of seedPlans as SeedPlan[]) {
              const plan = plans.prepareCreate((record) => {
                record.userId = 'local-user';
                record.name = item.name;
                record.description = item.description;
              });
              records.push(plan);
              item.exercises.forEach((entry, orderIndex) => {
                records.push(
                  planExerciseCollection.prepareCreate((record) => {
                    record.planId = plan.id;
                    record.exerciseId = `dataset-${entry.dataset_id}`;
                    record.targetSets = entry.sets;
                    record.targetReps = entry.reps;
                    record.orderIndex = orderIndex;
                  }),
                );
              });
            }
            await database.batch(records);
          });
        }

        if (mounted) setIsReady(true);
      } catch (cause) {
        if (mounted) setError(cause as Error);
      }
    }

    initialize();
    return () => {
      mounted = false;
    };
  }, [attempt]);

  return {
    isReady,
    error,
    retry: () => {
      setIsReady(false);
      setAttempt((value) => value + 1);
    },
  };
}
