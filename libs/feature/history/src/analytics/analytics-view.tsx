import React from 'react';
import {
  EmptyState,
  FeedbackBanner,
  FilterChip,
  PrimaryButton,
  ProgressChart,
  ScrollView,
  Text,
  TextInput,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import {
  type BodyMetric,
  type Exercise,
  useAppState,
  type WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import { useAnalytics } from './use-analytics';

export type AnalyticsViewProps = {
  metrics: BodyMetric[];
  sets: WorkoutSet[];
  exercises: Exercise[];
};

export function AnalyticsView({
  metrics,
  sets,
  exercises,
}: AnalyticsViewProps) {
  const { weightUnit } = useAppState();
  const muted = useCSSVariable('--muted') as string;
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
  } = useAnalytics(sets, exercises);

  return (
    <View className="gap-4">
      <ProgressChart
        label="Body weight"
        unit={weightUnit}
        values={[...metrics].reverse().map((item) => item.bodyWeight)}
      />
      {exerciseIds.length ? (
        <>
          <ScrollView
            className="-mx-5"
            contentContainerClassName="gap-2 px-5"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {exerciseIds.map((exerciseId) => {
              const exercise = exercises.find(
                (item) => item.id === exerciseId,
              );
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
            label={`${selectedExercise?.name ?? 'Exercise'} estimated 1RM`}
            unit={weightUnit}
            values={oneRmValues}
          />
        </>
      ) : null}

      {!metrics.length && !oneRmValues.length ? (
        <EmptyState
          message="Log a body metric below or complete weighted sets to establish your baseline."
          title="Your first trend starts here"
        />
      ) : null}

      <View className="mt-7">
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
              placeholderTextColor={muted}
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
              placeholderTextColor={muted}
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
