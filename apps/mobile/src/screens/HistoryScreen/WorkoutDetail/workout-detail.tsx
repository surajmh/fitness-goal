import React from 'react';
import { Copy } from '../../../ui/icons';
import { FeedbackBanner } from '../../../ui/FeedbackBanner';
import { PrimaryButton } from '../../../ui/PrimaryButton';
import { ScreenTitle } from '../../../ui/ScreenTitle';
import { TextButton } from '../../../ui/TextButton';
import { Text, useCSSVariable, View } from '../../../ui/primitives';
import { ExerciseArtwork, Page } from '../../shared/screen-shared';
import {
  formatSetPerformance,
  formatWorkoutDuration,
} from '../history-screen.helpers';
import type { WorkoutDetailProps } from './workout-detail.types';
import { useWorkoutDetail } from './use-workout-detail';

export function WorkoutDetail({
  exercises,
  onBack,
  onDelete,
  onRepeat,
  session,
  summary,
  weightUnit,
}: WorkoutDetailProps) {
  const onPrimary = useCSSVariable('--on-primary') as string;
  const { confirmDelete, error, repeat, repeating } = useWorkoutDetail({
    onDelete,
    onRepeat,
  });
  const exerciseGroups = Object.entries(summary.grouped);
  const duration = formatWorkoutDuration(session.startTime, session.endTime);

  return (
    <Page>
      <View className="mb-2 items-start">
        <TextButton label="Back to history" onPress={onBack} />
      </View>
      <ScreenTitle
        title={session.planId ? 'Planned workout' : 'Unplanned workout'}
        subtitle={new Date(session.startTime).toLocaleString()}
      />

      <View
        accessible
        accessibilityLabel={`${summary.sessionSets.length} sets, ${Math.round(summary.volume).toLocaleString()} ${weightUnit} volume, ${duration} duration`}
        className="mb-7 flex-row rounded-xl bg-surface py-4"
      >
        {[
          { label: 'Sets', value: summary.sessionSets.length },
          {
            label: 'Volume',
            value: `${Math.round(summary.volume).toLocaleString()} ${weightUnit}`,
          },
          { label: 'Duration', value: duration },
        ].map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center px-2 ${index ? 'border-l border-outline' : ''}`}
          >
            <Text className="text-sm font-semibold text-muted">
              {item.label}
            </Text>
            <Text className="mt-1 text-lg font-bold tabular-nums text-ink">
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <View className="mb-3 flex-row items-baseline justify-between">
        <Text accessibilityRole="header" className="text-xl font-bold text-ink">
          Exercises
        </Text>
        <Text className="text-sm text-muted">
          {exerciseGroups.length}{' '}
          {exerciseGroups.length === 1 ? 'movement' : 'movements'}
        </Text>
      </View>

      {exerciseGroups.map(([exerciseId, items]) => {
        const exercise = exercises.find((item) => item.id === exerciseId);
        return (
          <View key={exerciseId} className="mb-6">
            <View className="flex-row items-center gap-3">
              <ExerciseArtwork compact exercise={exercise} />
              <View className="min-w-0 flex-1">
                <Text className="text-lg font-bold text-ink">
                  {exercise?.name ?? 'Exercise'}
                </Text>
                <Text className="text-sm text-muted">
                  {items.length} {items.length === 1 ? 'set' : 'sets'} completed
                </Text>
              </View>
            </View>

            <View className="mt-3 overflow-hidden rounded-xl bg-surface px-4">
              {items.map((item, index) => (
                <View
                  key={item.id ?? `${exerciseId}-${item.setNumber}-${index}`}
                  accessible
                  accessibilityLabel={`Set ${item.setNumber}: ${formatSetPerformance(item, weightUnit)}${item.rpe ? `, RPE ${item.rpe}` : ''}`}
                  className={`min-h-12 flex-row items-center ${index ? 'border-t border-outline' : ''}`}
                >
                  <Text className="w-14 text-sm font-semibold text-muted">
                    Set {item.setNumber}
                  </Text>
                  <Text className="min-w-0 flex-1 text-base font-semibold tabular-nums text-ink">
                    {formatSetPerformance(item, weightUnit)}
                  </Text>
                  <Text className="ml-2 text-sm tabular-nums text-muted">
                    {item.rpe ? `RPE ${item.rpe}` : 'Complete'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {session.notes ? (
        <View className="mb-7">
          <Text
            accessibilityRole="header"
            className="mb-3 text-xl font-bold text-ink"
          >
            Notes
          </Text>
          <View className="rounded-xl bg-surface p-4">
            <Text className="text-base leading-6 text-ink">
              {session.notes}
            </Text>
          </View>
        </View>
      ) : null}

      {error ? (
        <View className="mb-3">
          <FeedbackBanner message={error} tone="error" />
        </View>
      ) : null}
      <PrimaryButton
        icon={<Copy color={onPrimary} size={18} />}
        label="Repeat this workout"
        loading={repeating}
        onPress={repeat}
      />
      <View className="mt-6 border-t border-outline pt-3">
        <TextButton
          destructive
          label="Delete workout"
          onPress={confirmDelete}
        />
      </View>
    </Page>
  );
}
