/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Switch } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { Minus, Plus } from '../../ui/icons';
import { database, Exercise, OverloadSetting } from '../../database';
import { useAppState } from '../../state/app-context';
import { FeedbackBanner } from '../../ui/FeedbackBanner';
import { HealthSyncCard } from '../../ui/HealthSyncCard';
import { FilterChip } from '../../ui/FilterChip';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { Row } from '../../ui/Row';
import { ScreenTitle } from '../../ui/ScreenTitle';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useCSSVariable,
  View,
} from '../../ui/primitives';
import { Page, USER_ID } from '../shared/screen-shared';
import type { SettingsScreenProps } from './settings-screen.types';
import { useSettingsScreen } from './use-settings-screen';
import { useHealthSync } from '../../health';

function SettingsBase({ exercises, overloadSettings }: SettingsScreenProps) {
  const healthSync = useHealthSync();
  const { weightUnit, setWeightUnit, restTimerSeconds, setRestTimerSeconds } =
    useAppState();
  const muted = useCSSVariable('--muted') as string;
  const {
    selectedExerciseId,
    setSelectedExerciseId,
    triggerReps,
    setTriggerReps,
    increaseBy,
    setIncreaseBy,
    feedback,
    error,
    saveOverload,
  } = useSettingsScreen({ exercises, overloadSettings });

  return (
    <Page>
      <ScreenTitle
        title="Settings"
        subtitle="Preferences stay with your local profile."
      />
      <View className="rounded-xl bg-surface px-4">
        <Row
          title="Use kilograms"
          subtitle={`Currently showing ${weightUnit}`}
          trailing={
            <Switch
              accessibilityLabel="Use kilograms"
              onValueChange={(enabled) => setWeightUnit(enabled ? 'kg' : 'lb')}
              value={weightUnit === 'kg'}
            />
          }
        />
        <Row
          title="Default rest timer"
          subtitle="Starts after a completed set"
          trailing={
            <View className="flex-row items-center gap-1">
              <Pressable
                accessibilityLabel="Decrease default rest timer by 15 seconds"
                className="h-12 w-12 items-center justify-center"
                onPress={() =>
                  setRestTimerSeconds(Math.max(15, restTimerSeconds - 15))
                }
              >
                <Minus color={muted} size={19} />
              </Pressable>
              <Text className="min-w-12 text-center font-semibold text-primary">
                {Math.floor(restTimerSeconds / 60)}:
                {(restTimerSeconds % 60).toString().padStart(2, '0')}
              </Text>
              <Pressable
                accessibilityLabel="Increase default rest timer by 15 seconds"
                className="h-12 w-12 items-center justify-center"
                onPress={() =>
                  setRestTimerSeconds(Math.min(600, restTimerSeconds + 15))
                }
              >
                <Plus color={muted} size={19} />
              </Pressable>
            </View>
          }
        />
      </View>
      <View className="mt-7">
        <Text className="mb-1 text-xl font-bold text-ink">Health sync</Text>
        <Text className="mb-4 text-base leading-6 text-muted">
          Read data you choose to share and keep it locally on this device.
        </Text>
        <HealthSyncCard
          error={healthSync.error}
          loading={healthSync.loading}
          onConnect={healthSync.connect}
          onOpenSettings={healthSync.openSettings}
          onSync={healthSync.syncNow}
          status={healthSync.status}
          syncing={healthSync.syncing}
        />
      </View>
      <View className="mt-7">
        <Text className="mb-1 text-xl font-bold text-ink">
          Progressive overload
        </Text>
        <Text className="mb-4 text-base leading-6 text-muted">
          Set the rep threshold that earns a weight increase for each exercise.
        </Text>
        <ScrollView
          className="-mx-5"
          contentContainerClassName="gap-2 px-5"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {exercises.slice(0, 20).map((exercise) => (
            <FilterChip
              key={exercise.id}
              label={exercise.name}
              onPress={() => setSelectedExerciseId(exercise.id)}
              selected={selectedExerciseId === exercise.id}
            />
          ))}
        </ScrollView>
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-1.5 text-sm font-semibold text-muted">
              Trigger reps
            </Text>
            <TextInput
              className="min-h-12 rounded-xl bg-surface px-4 text-base text-ink"
              keyboardType="number-pad"
              onChangeText={setTriggerReps}
              placeholderTextColor={muted}
              value={triggerReps}
            />
          </View>
          <View className="flex-1">
            <Text className="mb-1.5 text-sm font-semibold text-muted">
              Increase by ({weightUnit})
            </Text>
            <TextInput
              className="min-h-12 rounded-xl bg-surface px-4 text-base text-ink"
              keyboardType="decimal-pad"
              onChangeText={setIncreaseBy}
              placeholderTextColor={muted}
              value={increaseBy}
            />
          </View>
        </View>
        <View className="mt-3">
          <PrimaryButton label="Save overload rule" onPress={saveOverload} />
        </View>
        {error ? (
          <View className="mt-3">
            <FeedbackBanner message={error} tone="error" />
          </View>
        ) : null}
        {feedback ? (
          <View className="mt-3">
            <FeedbackBanner message={feedback} />
          </View>
        ) : null}
      </View>
      <Text className="mt-6 text-sm leading-5 text-muted">
        Health records remain on this device and are only read while Fitness
        Goal is open.
      </Text>
    </Page>
  );
}

export const SettingsScreen = withObservables([], () => ({
  exercises: database
    .get<Exercise>('exercises')
    .query(Q.sortBy('name', Q.asc))
    .observe(),
  overloadSettings: database
    .get<OverloadSetting>('overload_settings')
    .query(Q.where('user_id', USER_ID))
    .observe(),
}))(SettingsBase as any) as React.ComponentType;
