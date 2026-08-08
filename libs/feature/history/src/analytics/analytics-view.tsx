import React from 'react';
import {
  EmptyState,
  FeedbackBanner,
  FilterChip,
  PrimaryButton,
  ProgressChart,
  ScrollView,
  StatTile,
  Text,
  TextInput,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import {
  type BodyMetric,
  type Exercise,
  type HealthRecord,
  useAppState,
  type WorkoutSession,
  type WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import { ANALYTICS_RANGES } from './analytics.helpers';
import { useAnalytics } from './use-analytics';

export type AnalyticsViewProps = {
  metrics: BodyMetric[];
  sets: WorkoutSet[];
  exercises: Exercise[];
  sessions: WorkoutSession[];
  sleepRecords: HealthRecord[];
};

export function AnalyticsView({
  metrics,
  sets,
  exercises,
  sessions,
  sleepRecords,
}: AnalyticsViewProps) {
  const { weightUnit } = useAppState();
  const placeholderInk = useCSSVariable('--placeholder-ink') as string;
  const {
    weight,
    setWeight,
    bodyFat,
    setBodyFat,
    feedback,
    metricError,
    exerciseIds,
    effectiveExerciseId,
    selectedExercise,
    oneRmValues,
    setSelectedExerciseId,
    addMetric,
    range,
    setRange,
    weeklyVolume,
    consistency,
    sleepHours,
  } = useAnalytics(sets, exercises, sessions, sleepRecords);

  return (
    <View className="gap-3">
      <ScrollView
        className="-mx-5"
        contentContainerClassName="gap-2 px-5"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {ANALYTICS_RANGES.map((item) => (
          <FilterChip
            key={item.key}
            label={item.label}
            onPress={() => setRange(item.key)}
            selected={range === item.key}
          />
        ))}
      </ScrollView>

      {exerciseIds.length ? (
        <>
          <ScrollView
            className="-mx-5"
            contentContainerClassName="gap-2 px-5"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {exerciseIds.map((exerciseId) => {
              const exercise = exercises.find((item) => item.id === exerciseId);
              return (
                <FilterChip
                  key={exerciseId}
                  label={exercise?.name ?? 'Exercise'}
                  onPress={() => setSelectedExerciseId(exerciseId)}
                  selected={effectiveExerciseId === exerciseId}
                />
              );
            })}
          </ScrollView>
          <ProgressChart
            label={`Estimated 1RM · ${selectedExercise?.name ?? 'Exercise'}`}
            role="coral"
            unit={weightUnit}
            values={oneRmValues}
          />
        </>
      ) : null}

      <ProgressChart
        label="Weekly volume"
        role="cyan"
        unit={weightUnit}
        values={weeklyVolume.map((value) => Math.round(value))}
      />

      <View className="flex-row gap-3">
        <StatTile
          caption="sessions kept"
          label="Consistency"
          role="lime"
          value={`${consistency}%`}
        />
        <StatTile
          caption={sleepHours ? 'avg sleep hrs' : 'connect health to see'}
          label="Recovery"
          role="recovery"
          value={sleepHours ? sleepHours.toFixed(1) : '—'}
        />
      </View>

      <ProgressChart
        label="Body weight"
        role="recovery"
        unit={weightUnit}
        values={[...metrics].reverse().map((item) => item.bodyWeight)}
      />

      {!metrics.length && !oneRmValues.length ? (
        <EmptyState
          message="Log a body metric below or complete weighted sets to establish your baseline."
          title="Your first trend starts here"
        />
      ) : null}

      <View className="mt-4">
        <Text className="mb-3 text-xl font-bold text-ink">Body check-in</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-1.5 text-sm font-semibold text-muted">
              Weight ({weightUnit})
            </Text>
            <TextInput
              className="min-h-12 rounded-xl bg-surface px-4 text-base text-ink"
              keyboardType="decimal-pad"
              onChangeText={setWeight}
              placeholder="175"
              placeholderTextColor={placeholderInk}
              value={weight}
            />
          </View>
          <View className="flex-1">
            <Text className="mb-1.5 text-sm font-semibold text-muted">
              Body fat %
            </Text>
            <TextInput
              className="min-h-12 rounded-xl bg-surface px-4 text-base text-ink"
              keyboardType="decimal-pad"
              onChangeText={setBodyFat}
              placeholder="Optional"
              placeholderTextColor={placeholderInk}
              value={bodyFat}
            />
          </View>
        </View>
        <View className="mt-3">
          <PrimaryButton
            disabled={!weight}
            label="Save check-in"
            onPress={addMetric}
          />
        </View>
        {metricError ? (
          <View className="mt-3">
            <FeedbackBanner message={metricError} tone="error" />
          </View>
        ) : null}
        {feedback ? (
          <View className="mt-3">
            <FeedbackBanner message={feedback} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
