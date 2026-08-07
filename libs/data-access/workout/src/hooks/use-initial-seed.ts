import { useEffect, useState } from 'react';
import { database, Exercise, User } from '../database';
import seed from '../assets/seed.json';

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
  is_custom: false;
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
                exercise.mediaUrl = undefined;
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
                  existing.instructions === item.instructions;
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
