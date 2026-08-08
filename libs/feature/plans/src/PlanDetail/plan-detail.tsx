import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {
  Copy,
  ExerciseArtwork,
  FeedbackBanner,
  FilterChip,
  Page,
  Pencil,
  Play,
  PrimaryButton,
  Row,
  ScreenTitle,
  Text,
  TextButton,
  TextInput,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import { PLAN_DIFFICULTIES } from '../plans-screen.helpers';
import type { PlanDetailProps } from './plan-detail.types';
import { usePlanDetail } from './use-plan-detail';

export function PlanDetail(props: PlanDetailProps) {
  const { entries, exercises, onBack, plan } = props;
  const muted = useCSSVariable('--muted') as string;
  const primary = useCSSVariable('--primary') as string;
  const onPrimary = useCSSVariable('--on-primary') as string;
  const detail = usePlanDetail(props);
  const totalSets = entries.reduce(
    (total, entry) => total + entry.targetSets,
    0,
  );

  if (detail.editing) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Page>
          <View className="mb-2 items-start">
            <TextButton label="Cancel editing" onPress={detail.cancelEditing} />
          </View>
          <ScreenTitle
            title="Edit plan"
            subtitle="Keep the plan recognizable when you are moving between sets."
          />
          <Text className="mb-2 text-base font-semibold text-ink">
            Plan name
          </Text>
          <TextInput
            accessibilityLabel="Plan name"
            className={`min-h-12 rounded-xl bg-surface px-4 text-base text-ink ${detail.nameTouched && !detail.name.trim() ? 'border border-danger' : ''}`}
            onBlur={() => detail.setNameTouched(true)}
            onChangeText={detail.setName}
            placeholder="Upper strength"
            placeholderTextColor={muted}
            value={detail.name}
          />
          {detail.nameTouched && !detail.name.trim() ? (
            <Text className="mt-2 text-sm font-semibold text-danger">
              Enter a plan name to save changes.
            </Text>
          ) : null}
          <Text className="mb-2 mt-5 text-base font-semibold text-ink">
            Difficulty
          </Text>
          <View className="flex-row gap-2">
            {PLAN_DIFFICULTIES.map((level) => (
              <FilterChip
                key={level.key}
                label={level.label}
                onPress={() => detail.setDifficulty(level.key)}
                selected={detail.difficulty === level.key}
              />
            ))}
          </View>
          <Text className="mb-2 mt-5 text-base font-semibold text-ink">
            Description
          </Text>
          <TextInput
            accessibilityLabel="Plan description"
            className="min-h-24 rounded-xl bg-surface p-4 text-base text-ink"
            multiline
            onChangeText={detail.setDescription}
            placeholder="Bench, rows, and shoulder work"
            placeholderTextColor={muted}
            textAlignVertical="top"
            value={detail.description}
          />
          {detail.error ? (
            <View className="mt-4">
              <FeedbackBanner message={detail.error} tone="error" />
            </View>
          ) : null}
          <View className="mt-6">
            <PrimaryButton
              disabled={!detail.name.trim()}
              label="Save changes"
              loading={detail.action === 'save'}
              onPress={detail.save}
            />
          </View>
        </Page>
      </KeyboardAvoidingView>
    );
  }

  return (
    <Page>
      <View className="mb-2 items-start">
        <TextButton label="Back to plans" onPress={onBack} />
      </View>
      <ScreenTitle
        title={plan.name}
        subtitle={plan.description || 'Saved workout plan'}
      />

      <View
        accessible
        accessibilityLabel={`${entries.length} exercises and ${totalSets} planned sets`}
        className="mb-7 flex-row rounded-xl bg-surface py-4"
      >
        {[
          { label: 'Exercises', value: entries.length },
          { label: 'Planned sets', value: totalSets },
        ].map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center ${index ? 'border-l border-outline' : ''}`}
          >
            <Text className="text-sm font-semibold text-muted">
              {item.label}
            </Text>
            <Text className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Text
        accessibilityRole="header"
        className="mb-2 text-xl font-bold text-ink"
      >
        Exercise order
      </Text>
      <View className="mb-7 rounded-xl bg-surface px-4">
        {entries.map((entry) => {
          const exercise = exercises.find(
            (item) => item.id === entry.exerciseId,
          );
          return (
            <Row
              key={entry.id}
              leading={<ExerciseArtwork compact exercise={exercise} />}
              subtitle={`${entry.targetSets} sets × ${entry.targetReps} reps`}
              title={exercise?.name ?? 'Exercise'}
            />
          );
        })}
      </View>

      {detail.error ? (
        <View className="mb-3">
          <FeedbackBanner message={detail.error} tone="error" />
        </View>
      ) : null}
      <View className="gap-3">
        <PrimaryButton
          disabled={detail.action !== null}
          icon={<Play color={onPrimary} size={18} />}
          label="Start this workout"
          loading={detail.action === 'start'}
          onPress={detail.start}
        />
        <PrimaryButton
          disabled={detail.action !== null}
          icon={<Copy color={primary} size={18} />}
          label="Duplicate plan"
          loading={detail.action === 'duplicate'}
          onPress={detail.duplicate}
          variant="secondary"
        />
        <PrimaryButton
          disabled={detail.action !== null}
          icon={<Pencil color={primary} size={18} />}
          label="Edit name and description"
          onPress={detail.beginEditing}
          variant="secondary"
        />
      </View>
      <View className="mt-6 border-t border-outline pt-3">
        <TextButton
          destructive
          label="Delete plan"
          onPress={detail.confirmDelete}
        />
      </View>
    </Page>
  );
}
