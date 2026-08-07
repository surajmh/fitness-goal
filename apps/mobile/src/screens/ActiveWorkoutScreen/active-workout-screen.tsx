/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  ChevronDown,
  ChevronUp,
  CirclePlus,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
  TimerReset,
} from '../../ui/icons';
import { database, Exercise, WorkoutSession, WorkoutSet } from '../../database';
import {
  addExerciseToSession,
  addSet,
  abandonSession,
  finishSession,
  moveExercise,
  removeExerciseFromSession,
  removeSet,
  toggleSetComplete,
  updateSessionNotes,
} from '../../database/workout-service';
import { useRestTimer } from '../../hooks/use-rest-timer';
import { useAppState } from '../../state/app-context';
import { EmptyState } from '../../ui/EmptyState';
import { FeedbackBanner } from '../../ui/FeedbackBanner';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { TextButton } from '../../ui/TextButton';
import {
  Pressable,
  Text,
  TextInput,
  useCSSVariable,
  View,
} from '../../ui/primitives';
import {
  Page,
  ExerciseArtwork,
  ExerciseMotionPreview,
} from '../shared/screen-shared';
import { ExercisePicker } from '../ExercisePicker';
import { SetEditor } from '../SetEditor';
import type { ActiveWorkoutScreenProps } from './active-workout-screen.types';
import { useActiveWorkoutScreen } from './use-active-workout-screen';

function ActiveWorkoutBase({
  session,
  sets,
  exercises,
  historySets,
}: ActiveWorkoutScreenProps) {
  const { setActiveSessionId, weightUnit, restTimerSeconds } = useAppState();
  const primary = useCSSVariable('--primary') as string;
  const onPrimary = useCSSVariable('--on-primary') as string;
  const onRecovery = useCSSVariable('--on-recovery') as string;
  const muted = useCSSVariable('--muted') as string;
  const { secondsLeft, isRunning, start, cancel } = useRestTimer();
  const [showPicker, setShowPicker] = useState(false);
  const [notes, setNotes] = useState(session.notes ?? '');
  const [message, setMessage] = useState('');
  const { orderedGroups, activeExerciseId, completed, volume, lastCompleted } =
    useActiveWorkoutScreen(sets);

  if (showPicker) {
    return (
      <Page>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-ink">Add exercise</Text>
          <TextButton label="Done" onPress={() => setShowPicker(false)} />
        </View>
        <ExercisePicker
          onToggle={async (exerciseId) => {
            await addExerciseToSession(session.id, exerciseId);
            setShowPicker(false);
          }}
          selectedIds={orderedGroups.map(([exerciseId]) => exerciseId)}
        />
      </Page>
    );
  }

  return (
    <Page>
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="text-3xl font-bold tracking-tight text-ink">
            Active workout
          </Text>
          <Text className="mt-1 text-base text-muted">
            {completed} of {sets.length} sets complete
          </Text>
        </View>
        <TextButton
          label="Finish"
          onPress={() =>
            Alert.alert(
              'Finish workout?',
              `${completed} sets · ${Math.round(volume).toLocaleString()} ${weightUnit} volume. Your completed sets are already saved.`,
              [
                { text: 'Keep training', style: 'cancel' },
                {
                  text: 'Finish',
                  onPress: async () => {
                    await finishSession(session, notes);
                    await cancel();
                    setActiveSessionId(null);
                  },
                },
              ],
            )
          }
        />
      </View>
      {message ? (
        <View className="mb-4">
          <FeedbackBanner message={message} />
        </View>
      ) : null}

      {isRunning ? (
        <View className="mb-5 flex-row items-center gap-4 rounded-xl bg-recovery p-4">
          <TimerReset color={onRecovery} size={24} />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-on-recovery">
              REST TIMER
            </Text>
            <Text className="text-2xl font-bold tabular-nums text-on-recovery">
              {Math.floor(secondsLeft / 60)}:
              {(secondsLeft % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Add 30 seconds to rest timer"
            className="min-h-12 justify-center rounded-xl bg-canvas px-3"
            onPress={() => start(secondsLeft + 30)}
          >
            <Text className="font-bold text-primary">+30s</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Cancel rest timer"
            className="h-12 w-12 items-center justify-center"
            onPress={cancel}
          >
            <Minus color={onRecovery} size={22} />
          </Pressable>
        </View>
      ) : null}

      {!sets.length ? (
        <EmptyState
          action={
            <PrimaryButton
              icon={<CirclePlus color={onPrimary} size={20} />}
              label="Add first exercise"
              onPress={() => setShowPicker(true)}
            />
          }
          message="Choose any movement from the local catalog. Sets appear instantly."
          title="This workout is empty"
        />
      ) : null}

      {orderedGroups.map(([exerciseId, exerciseSets], exerciseIndex) => {
        const exercise = exercises.find((item) => item.id === exerciseId);
        return (
          <View key={exerciseId} className="mb-5">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="min-w-0 flex-1 flex-row items-center gap-3">
                <ExerciseArtwork exercise={exercise} />
                <View className="min-w-0 flex-1">
                  <Text className="text-xl font-bold text-ink">
                    {exercise?.name ?? 'Exercise'}
                  </Text>
                  <Text className="mt-0.5 text-sm text-muted">
                    {exercise?.muscleGroup} · {exercise?.equipment}
                  </Text>
                </View>
              </View>
              <View className="flex-row">
                <Pressable
                  accessibilityLabel={`Move ${exercise?.name} up`}
                  disabled={exerciseIndex === 0}
                  className="h-12 w-12 items-center justify-center"
                  onPress={() => moveExercise(session.id, exerciseId, -1)}
                >
                  <ChevronUp color={muted} size={20} />
                </Pressable>
                <Pressable
                  accessibilityLabel={`Move ${exercise?.name} down`}
                  disabled={exerciseIndex === orderedGroups.length - 1}
                  className="h-12 w-12 items-center justify-center"
                  onPress={() => moveExercise(session.id, exerciseId, 1)}
                >
                  <ChevronDown color={muted} size={20} />
                </Pressable>
                <Pressable
                  accessibilityLabel={`Remove ${exercise?.name}`}
                  className="h-12 w-12 items-center justify-center"
                  onPress={() =>
                    Alert.alert(
                      `Remove ${exercise?.name}?`,
                      'All of its sets will be removed from this workout.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Remove',
                          style: 'destructive',
                          onPress: () =>
                            removeExerciseFromSession(session.id, exerciseId),
                        },
                      ],
                    )
                  }
                >
                  <Trash2 color={muted} size={19} />
                </Pressable>
              </View>
            </View>
            {exercise && exerciseId === activeExerciseId ? (
              <ExerciseMotionPreview exercise={exercise} />
            ) : null}
            <View className="rounded-xl border border-outline bg-surface px-3">
              <View className="flex-row items-center gap-2 border-b border-outline py-2">
                <Text className="w-8 text-center text-xs font-semibold text-muted">
                  SET
                </Text>
                <Text className="flex-1 text-center text-xs font-semibold text-muted">
                  {weightUnit.toUpperCase()}
                </Text>
                <Text className="flex-1 text-center text-xs font-semibold text-muted">
                  REPS
                </Text>
                <Text className="w-14 text-center text-xs font-semibold text-muted">
                  RPE
                </Text>
                <View className="w-12" />
                <View className="w-12" />
              </View>
              {exerciseSets.map((item) => (
                <SetEditor
                  key={item.id}
                  item={item}
                  onCompleted={() => start(restTimerSeconds)}
                  onDuplicate={() => addSet(session.id, exerciseId, item)}
                  onRemove={() => removeSet(item)}
                  previous={historySets.find(
                    (previous) =>
                      previous.exerciseId === exerciseId &&
                      previous.setNumber === item.setNumber,
                  )}
                  unit={weightUnit}
                />
              ))}
              <Pressable
                accessibilityRole="button"
                className="min-h-12 flex-row items-center justify-center gap-2"
                onPress={() => addSet(session.id, exerciseId)}
              >
                <Plus color={primary} size={18} />
                <Text className="font-semibold text-primary">Add set</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
      {sets.length ? (
        <Pressable
          accessibilityRole="button"
          className="min-h-12 flex-row items-center justify-center gap-2 rounded-xl bg-surface"
          onPress={() => setShowPicker(true)}
        >
          <Plus color={primary} size={20} />
          <Text className="font-semibold text-primary">Add exercise</Text>
        </Pressable>
      ) : null}
      {lastCompleted ? (
        <Pressable
          accessibilityRole="button"
          className="mt-3 min-h-12 flex-row items-center justify-center gap-2 rounded-xl bg-surface"
          onPress={async () => {
            await toggleSetComplete(lastCompleted);
            setMessage(`Set ${lastCompleted.setNumber} marked incomplete.`);
          }}
        >
          <RotateCcw color={primary} size={18} />
          <Text className="font-semibold text-primary">
            Undo last completed set
          </Text>
        </Pressable>
      ) : null}
      <View className="mt-6">
        <Text className="mb-2 text-base font-bold text-ink">Workout notes</Text>
        <TextInput
          accessibilityLabel="Workout notes"
          className="min-h-24 rounded-xl bg-surface p-4 text-base text-ink"
          multiline
          onBlur={() => updateSessionNotes(session, notes)}
          onChangeText={setNotes}
          placeholder="Optional notes for your future self"
          placeholderTextColor={muted}
          textAlignVertical="top"
          value={notes}
        />
      </View>
      <TextButton
        destructive
        label="Discard workout"
        onPress={() =>
          Alert.alert(
            'Discard this workout?',
            'This removes the session and all of its sets from this device.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Discard',
                style: 'destructive',
                onPress: async () => {
                  await cancel();
                  await abandonSession(session);
                  setActiveSessionId(null);
                },
              },
            ],
          )
        }
      />
    </Page>
  );
}

export const ActiveWorkoutScreen = withObservables(
  ['sessionId'],
  ({ sessionId }: { sessionId: string }) => ({
    session: database
      .get<WorkoutSession>('workout_sessions')
      .findAndObserve(sessionId),
    sets: database
      .get<WorkoutSet>('workout_sets')
      .query(
        Q.where('session_id', sessionId),
        Q.sortBy('order_index', Q.asc),
        Q.sortBy('set_number', Q.asc),
      )
      .observe(),
    historySets: database
      .get<WorkoutSet>('workout_sets')
      .query(
        Q.where('session_id', Q.notEq(sessionId)),
        Q.where('is_completed', true),
        Q.sortBy('updated_at', Q.desc),
      )
      .observe(),
    exercises: database.get<Exercise>('exercises').query().observe(),
  }),
)(ActiveWorkoutBase as any) as React.ComponentType<{ sessionId: string }>;
