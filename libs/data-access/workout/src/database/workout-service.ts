import { Model, Q } from '@nozbe/watermelondb';
import {
  database,
  PlanExercise,
  WorkoutPlan,
  WorkoutSession,
  WorkoutSet,
} from './index';

const USER_ID = 'local-user';

export async function createPlan(input: {
  name: string;
  description: string;
  exercises: Array<{
    exerciseId: string;
    targetSets: number;
    targetReps: number;
  }>;
}) {
  return database.write(async () => {
    const plans = database.get<WorkoutPlan>('workout_plans');
    const planExercises = database.get<PlanExercise>('plan_exercises');
    const plan = plans.prepareCreate((record) => {
      record.userId = USER_ID;
      record.name = input.name;
      record.description = input.description;
    });
    const entries = input.exercises.map((item, orderIndex) =>
      planExercises.prepareCreate((record) => {
        record.planId = plan.id;
        record.exerciseId = item.exerciseId;
        record.targetSets = item.targetSets;
        record.targetReps = item.targetReps;
        record.orderIndex = orderIndex;
      }),
    );
    await database.batch(plan, ...entries);
    return plan;
  });
}

export async function startSession(planId?: string) {
  return database.write(async () => {
    const sessions = database.get<WorkoutSession>('workout_sessions');
    const sets = database.get<WorkoutSet>('workout_sets');
    const session = sessions.prepareCreate((record) => {
      record.userId = USER_ID;
      record.planId = planId;
      record.startTime = Date.now();
      record.notes = '';
    });
    const operations: Model[] = [session];

    if (planId) {
      const planned = await database
        .get<PlanExercise>('plan_exercises')
        .query(Q.where('plan_id', planId), Q.sortBy('order_index', Q.asc))
        .fetch();

      for (const item of planned) {
        for (let index = 0; index < item.targetSets; index += 1) {
          operations.push(
            sets.prepareCreate((record) => {
              record.sessionId = session.id;
              record.exerciseId = item.exerciseId;
              record.setNumber = index + 1;
              record.orderIndex = item.orderIndex;
              record.reps = item.targetReps;
              record.isCompleted = false;
            }),
          );
        }
      }
    }

    await database.batch(...operations);
    return session;
  });
}

export async function duplicateSession(sourceId: string) {
  const sourceSets = await database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('session_id', sourceId), Q.sortBy('created_at', Q.asc))
    .fetch();

  return database.write(async () => {
    const sessions = database.get<WorkoutSession>('workout_sessions');
    const sets = database.get<WorkoutSet>('workout_sets');
    const session = sessions.prepareCreate((record) => {
      record.userId = USER_ID;
      record.startTime = Date.now();
      record.notes = 'Repeated session';
    });
    const copied = sourceSets.map((source) =>
      sets.prepareCreate((record) => {
        record.sessionId = session.id;
        record.exerciseId = source.exerciseId;
        record.setNumber = source.setNumber;
        record.orderIndex = source.orderIndex;
        record.weight = source.weight;
        record.reps = source.reps;
        record.durationSeconds = source.durationSeconds;
        record.rpe = source.rpe;
        record.isCompleted = false;
      }),
    );
    await database.batch(session, ...copied);
    return session;
  });
}

export async function addExerciseToSession(
  sessionId: string,
  exerciseId: string,
  targetSets = 3,
  targetReps = 8,
) {
  const existing = await database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('session_id', sessionId), Q.sortBy('order_index', Q.desc))
    .fetch();
  const orderIndex = existing[0] ? (existing[0].orderIndex ?? 0) + 1 : 0;
  return database.write(async () => {
    const sets = database.get<WorkoutSet>('workout_sets');
    const operations = Array.from({ length: targetSets }, (_, index) =>
      sets.prepareCreate((record) => {
        record.sessionId = sessionId;
        record.exerciseId = exerciseId;
        record.setNumber = index + 1;
        record.orderIndex = orderIndex;
        record.reps = targetReps;
        record.isCompleted = false;
      }),
    );
    await database.batch(...operations);
  });
}

export async function updateSet(
  workoutSet: WorkoutSet,
  input: {
    weight?: number;
    reps?: number;
    durationSeconds?: number;
    rpe?: number;
  },
) {
  return database.write(async () => {
    await workoutSet.update((record) => {
      record.weight = input.weight;
      record.reps = input.reps;
      record.durationSeconds = input.durationSeconds;
      record.rpe = input.rpe;
    });
  });
}

export async function addSet(
  sessionId: string,
  exerciseId: string,
  source?: WorkoutSet,
) {
  const exerciseSets = await database
    .get<WorkoutSet>('workout_sets')
    .query(
      Q.where('session_id', sessionId),
      Q.where('exercise_id', exerciseId),
      Q.sortBy('set_number', Q.desc),
    )
    .fetch();
  const last = exerciseSets[0];
  return database.write(() =>
    database.get<WorkoutSet>('workout_sets').create((record) => {
      record.sessionId = sessionId;
      record.exerciseId = exerciseId;
      record.setNumber = (last?.setNumber ?? 0) + 1;
      record.orderIndex = last?.orderIndex ?? source?.orderIndex ?? 0;
      record.weight = source?.weight ?? last?.weight;
      record.reps = source?.reps ?? last?.reps;
      record.rpe = source?.rpe ?? last?.rpe;
      record.isCompleted = false;
    }),
  );
}

export async function removeSet(workoutSet: WorkoutSet) {
  const siblings = await database
    .get<WorkoutSet>('workout_sets')
    .query(
      Q.where('session_id', workoutSet.sessionId),
      Q.where('exercise_id', workoutSet.exerciseId),
      Q.where('set_number', Q.gt(workoutSet.setNumber)),
    )
    .fetch();
  return database.write(async () => {
    await database.batch(
      workoutSet.prepareDestroyPermanently(),
      ...siblings.map((item) =>
        item.prepareUpdate((record) => {
          record.setNumber -= 1;
        }),
      ),
    );
  });
}

export async function removeExerciseFromSession(
  sessionId: string,
  exerciseId: string,
) {
  const items = await database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('session_id', sessionId), Q.where('exercise_id', exerciseId))
    .fetch();
  return database.write(() =>
    database.batch(...items.map((item) => item.prepareDestroyPermanently())),
  );
}

export async function moveExercise(
  sessionId: string,
  exerciseId: string,
  direction: -1 | 1,
) {
  const all = await database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('session_id', sessionId), Q.sortBy('order_index', Q.asc))
    .fetch();
  const groups = [...new Set(all.map((item) => item.exerciseId))];
  const from = groups.indexOf(exerciseId);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= groups.length) return;
  const currentOrder =
    all.find((item) => item.exerciseId === groups[from])?.orderIndex ?? from;
  const targetOrder =
    all.find((item) => item.exerciseId === groups[to])?.orderIndex ?? to;
  return database.write(() =>
    database.batch(
      ...all
        .filter(
          (item) =>
            item.exerciseId === groups[from] || item.exerciseId === groups[to],
        )
        .map((item) =>
          item.prepareUpdate((record) => {
            record.orderIndex =
              item.exerciseId === groups[from] ? targetOrder : currentOrder;
          }),
        ),
    ),
  );
}

export async function deletePlan(plan: WorkoutPlan) {
  const entries = await database
    .get<PlanExercise>('plan_exercises')
    .query(Q.where('plan_id', plan.id))
    .fetch();
  return database.write(() =>
    database.batch(
      ...entries.map((item) => item.prepareDestroyPermanently()),
      plan.prepareDestroyPermanently(),
    ),
  );
}

export async function updatePlan(
  plan: WorkoutPlan,
  input: { name: string; description: string },
) {
  return database.write(() =>
    plan.update((record) => {
      record.name = input.name;
      record.description = input.description;
    }),
  );
}

export async function findActiveSession() {
  const sessions = await database
    .get<WorkoutSession>('workout_sessions')
    .query(Q.where('end_time', null), Q.sortBy('start_time', Q.desc), Q.take(1))
    .fetch();
  return sessions[0] ?? null;
}

export async function abandonSession(session: WorkoutSession) {
  return deleteSession(session);
}

export async function deleteSession(session: WorkoutSession) {
  const sets = await database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('session_id', session.id))
    .fetch();
  return database.write(() =>
    database.batch(
      ...sets.map((item) => item.prepareDestroyPermanently()),
      session.prepareDestroyPermanently(),
    ),
  );
}

export async function updateSessionNotes(
  session: WorkoutSession,
  notes: string,
) {
  return database.write(() =>
    session.update((record) => {
      record.notes = notes;
    }),
  );
}

export async function toggleSetComplete(workoutSet: WorkoutSet) {
  return database.write(async () => {
    await workoutSet.update((record) => {
      record.isCompleted = !record.isCompleted;
    });
  });
}

export async function finishSession(session: WorkoutSession, notes = '') {
  return database.write(async () => {
    await session.update((record) => {
      record.endTime = Date.now();
      record.notes = notes;
    });
  });
}

export function estimatedOneRepMax(weight: number, reps: number) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
