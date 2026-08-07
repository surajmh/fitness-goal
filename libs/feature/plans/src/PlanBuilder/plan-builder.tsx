import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  ExerciseArtwork,
  FeedbackBanner,
  Page,
  Pressable,
  PrimaryButton,
  ScreenTitle,
  Text,
  TextButton,
  TextInput,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import { ExercisePicker } from '@fitnessgoal/feature/exercise-picker';
import { hasInvalidTargets } from '../plans-screen.helpers';
import type { PlanBuilderProps } from './plan-builder.types';
import { usePlanBuilder } from './use-plan-builder';

export function PlanBuilder(props: PlanBuilderProps) {
  const muted = useCSSVariable('--muted') as string;
  const builder = usePlanBuilder(props);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Page>
        <View className="mb-5 flex-row items-center justify-between">
          <TextButton label="Cancel" onPress={builder.requestCancel} />
          <Text className="text-sm font-semibold text-muted">
            Step {builder.step} of 3
          </Text>
        </View>
        <View
          accessible
          accessibilityLabel={`Plan builder, step ${builder.step} of 3`}
          className="mb-6 flex-row gap-2"
        >
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              className={`h-1.5 flex-1 rounded-full ${step <= builder.step ? 'bg-primary' : 'bg-outline'}`}
            />
          ))}
        </View>

        {builder.step === 1 ? (
          <>
            <ScreenTitle
              title="Name the session"
              subtitle="Choose a name you can recognize quickly on a busy training day."
            />
            <Text className="mb-2 text-base font-semibold text-ink">
              Plan name
            </Text>
            <TextInput
              accessibilityLabel="Plan name"
              autoFocus
              className={`min-h-12 rounded-xl bg-surface px-4 text-base text-ink ${builder.nameTouched && !builder.name.trim() ? 'border border-danger' : ''}`}
              onBlur={() => builder.setNameTouched(true)}
              onChangeText={builder.setName}
              placeholder="Upper strength"
              placeholderTextColor={muted}
              value={builder.name}
            />
            {builder.nameTouched && !builder.name.trim() ? (
              <Text className="mt-2 text-sm font-semibold text-danger">
                Enter a plan name to continue.
              </Text>
            ) : null}
            <Text className="mb-2 mt-5 text-base font-semibold text-ink">
              Description
            </Text>
            <TextInput
              accessibilityLabel="Plan description"
              className="min-h-24 rounded-xl bg-surface p-4 text-base text-ink"
              multiline
              onChangeText={builder.setDescription}
              placeholder="Bench, rows, and shoulder work"
              placeholderTextColor={muted}
              textAlignVertical="top"
              value={builder.description}
            />
            <Text className="mt-2 text-sm text-muted">
              Optional context appears under the plan name.
            </Text>
            <View className="mt-6">
              <PrimaryButton
                disabled={!builder.name.trim()}
                label="Choose exercises"
                onPress={builder.next}
              />
            </View>
          </>
        ) : null}

        {builder.step === 2 ? (
          <>
            <ScreenTitle
              title="Choose exercises"
              subtitle={`${builder.selectedIds.length} selected · Search and filter the local catalog.`}
            />
            <ExercisePicker
              onToggle={builder.toggleExercise}
              selectedIds={builder.selectedIds}
            />
            <View className="mt-6 gap-2">
              <PrimaryButton
                disabled={!builder.selectedIds.length}
                label="Review plan"
                onPress={builder.next}
              />
              <TextButton label="Back" onPress={builder.back} />
            </View>
          </>
        ) : null}

        {builder.step === 3 ? (
          <>
            <ScreenTitle
              title="Review your plan"
              subtitle="Set targets and confirm the exercise order before saving."
            />
            <View className="mb-6 rounded-xl bg-surface p-4">
              <Text className="text-xl font-bold text-ink">{builder.name}</Text>
              <Text className="mt-1 text-base leading-6 text-muted">
                {builder.description || 'No description'}
              </Text>
            </View>

            {builder.selectedIds.map((id, index) => {
              const exercise = props.exercises.find((item) => item.id === id);
              const target = builder.targets[id] ?? { sets: '3', reps: '8' };
              return (
                <View key={id} className="mb-5">
                  <View className="mb-3 flex-row items-center gap-3">
                    <ExerciseArtwork compact exercise={exercise} />
                    <View className="min-w-0 flex-1">
                      <Text className="text-base font-bold text-ink">
                        {exercise?.name ?? 'Exercise'}
                      </Text>
                      <Text className="text-sm text-muted">
                        Exercise {index + 1} of {builder.selectedIds.length}
                      </Text>
                    </View>
                    {[
                      {
                        direction: -1 as const,
                        disabled: index === 0,
                        Icon: ChevronUp,
                        label: 'up',
                      },
                      {
                        direction: 1 as const,
                        disabled: index === builder.selectedIds.length - 1,
                        Icon: ChevronDown,
                        label: 'down',
                      },
                    ].map((control) => (
                      <Pressable
                        key={control.label}
                        accessibilityLabel={`Move ${exercise?.name ?? 'exercise'} ${control.label}`}
                        accessibilityState={{ disabled: control.disabled }}
                        className={`h-12 w-12 items-center justify-center rounded-xl active:bg-surface ${control.disabled ? 'opacity-40' : ''}`}
                        disabled={control.disabled}
                        onPress={() =>
                          builder.moveExercise(index, control.direction)
                        }
                      >
                        <control.Icon color={muted} size={20} />
                      </Pressable>
                    ))}
                  </View>
                  <View className="flex-row gap-3 rounded-xl bg-surface p-4">
                    {[
                      { key: 'sets' as const, label: 'Sets' },
                      { key: 'reps' as const, label: 'Reps' },
                    ].map((field) => {
                      const number = Number(target[field.key]);
                      const invalid = !Number.isFinite(number) || number < 1;
                      return (
                        <View key={field.key} className="flex-1">
                          <Text className="mb-1.5 text-sm font-semibold text-muted">
                            {field.label}
                          </Text>
                          <TextInput
                            accessibilityLabel={`${exercise?.name ?? 'Exercise'} ${field.label}`}
                            className={`min-h-12 rounded-xl bg-canvas px-4 text-center text-base font-semibold tabular-nums text-ink ${invalid ? 'border border-danger' : ''}`}
                            keyboardType="number-pad"
                            onChangeText={(value) =>
                              builder.setTarget(id, field.key, value)
                            }
                            value={target[field.key]}
                          />
                          {invalid ? (
                            <Text className="mt-1.5 text-xs font-semibold text-danger">
                              Enter 1 or more
                            </Text>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            {builder.error ? (
              <View className="mb-3">
                <FeedbackBanner message={builder.error} tone="error" />
              </View>
            ) : null}
            <View className="mt-2 gap-2">
              <PrimaryButton
                disabled={hasInvalidTargets(
                  builder.selectedIds,
                  builder.targets,
                )}
                label="Save workout plan"
                loading={builder.saving}
                onPress={builder.save}
              />
              <TextButton label="Back" onPress={builder.back} />
            </View>
          </>
        ) : null}
      </Page>
    </KeyboardAvoidingView>
  );
}
