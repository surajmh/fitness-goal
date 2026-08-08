/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Alert } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  ChevronRight,
  FeedbackBanner,
  GroupedList,
  HealthSyncCard,
  Info,
  Minus,
  Page,
  Plus,
  Pressable,
  PrimaryButton,
  Row,
  ScreenTitle,
  ScrollView,
  SearchField,
  SectionLabel,
  Text,
  TextInput,
  Trash2,
  useCSSVariable,
  useReduceMotion,
  USER_ID,
  View,
} from '@fitnessgoal/shared/ui';
import {
  database,
  Exercise,
  OverloadSetting,
  useAppState,
  useHealthSync,
} from '@fitnessgoal/data-access/workout';
import type { SettingsScreenProps } from './settings-screen.types';
import { useSettingsScreen } from './use-settings-screen';

function SettingsBase({ exercises, overloadSettings }: SettingsScreenProps) {
  const healthSync = useHealthSync();
  const { weightUnit, setWeightUnit, restTimerSeconds, setRestTimerSeconds } =
    useAppState();
  const muted = useCSSVariable('--muted') as string;
  const reduceMotion = useReduceMotion();
  const {
    selectedExerciseId,
    setSelectedExerciseId,
    selectedExercise,
    searchQuery,
    setSearchQuery,
    filteredExercises,
    overloadMap,
    configuredRules,
    triggerReps,
    setTriggerReps,
    increaseBy,
    setIncreaseBy,
    feedback,
    error,
    saveOverload,
    deleteOverload,
    handleStepReps,
    handleStepIncrease,
  } = useSettingsScreen({ exercises, overloadSettings });

  const repPresets = [8, 10, 12, 15];
  const weightPresets =
    weightUnit === 'kg' ? [1, 2.5, 5, 10] : [2.5, 5, 10, 15];
  const isSelectedConfigured = overloadMap.has(selectedExerciseId);

  return (
    <Page>
      <ScreenTitle title="Settings" />

      {/* Health Sync Section */}
      <View className="gap-1">
        <SectionLabel label="Health sync" />
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

      {/* Unit & Rest Timer Preferences */}
      <View className="mt-6 gap-1">
        <SectionLabel label="Training" />
        <GroupedList surface>
          <Row
            border={false}
            onPress={() =>
              Alert.alert('Units', undefined, [
                {
                  text: 'Kilograms',
                  onPress: () => void setWeightUnit('kg'),
                },
                { text: 'Pounds', onPress: () => void setWeightUnit('lb') },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
            title="Units"
            trailing={
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[15px] font-semibold text-muted">
                  {weightUnit === 'kg' ? 'Kilograms' : 'Pounds'}
                </Text>
                <ChevronRight color={muted} size={18} />
              </View>
            }
          />
          <Row
            border={false}
            title="Default rest timer"
            trailing={
              <View className="flex-row items-center gap-1">
                <Pressable
                  accessibilityLabel="Decrease default rest timer by 15 seconds"
                  className="h-10 w-10 items-center justify-center rounded-lg bg-canvas"
                  onPress={() =>
                    setRestTimerSeconds(Math.max(15, restTimerSeconds - 15))
                  }
                >
                  <Minus color={muted} size={19} />
                </Pressable>
                <Text className="min-w-14 text-center text-[15px] font-semibold tabular-nums text-ink">
                  {Math.floor(restTimerSeconds / 60)}:
                  {(restTimerSeconds % 60).toString().padStart(2, '0')}
                </Text>
                <Pressable
                  accessibilityLabel="Increase default rest timer by 15 seconds"
                  className="h-10 w-10 items-center justify-center rounded-lg bg-canvas"
                  onPress={() =>
                    setRestTimerSeconds(Math.min(600, restTimerSeconds + 15))
                  }
                >
                  <Plus color={muted} size={19} />
                </Pressable>
              </View>
            }
          />
        </GroupedList>
      </View>

      {/* Appearance & access */}
      <View className="mt-6 gap-1">
        <SectionLabel label="Appearance & access" />
        <GroupedList surface>
          <Row
            border={false}
            subtitle="Follows your device appearance"
            title="Theme"
            trailing={
              <Text className="text-[15px] font-semibold text-muted">
                System
              </Text>
            }
          />
          <Row
            border={false}
            subtitle="Follows your device accessibility setting"
            title="Reduce motion"
            trailing={
              <Text className="text-[15px] font-semibold text-muted">
                {reduceMotion ? 'On' : 'Off'}
              </Text>
            }
          />
        </GroupedList>
      </View>

      {/* Progressive Overload Section */}
      <View className="mt-6 gap-4">
        <View className="gap-1">
          <SectionLabel label="Progressive overload" />
          <Text className="text-[13px] font-medium leading-5 text-muted">
            Set target reps to automatically trigger weight increases during
            workout logging.
          </Text>
        </View>

        {/* Exercise Search & Selection */}
        <View className="gap-3">
          <SearchField
            onChangeText={setSearchQuery}
            placeholder="Search exercise..."
            value={searchQuery}
          />

          <ScrollView
            className="-mx-5"
            contentContainerClassName="gap-2 px-5"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filteredExercises.map((exercise) => {
              const isConfigured = overloadMap.has(exercise.id);
              const isSelected = selectedExerciseId === exercise.id;
              return (
                <Pressable
                  key={exercise.id}
                  accessibilityLabel={`Select ${exercise.name}`}
                  className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-2 border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-outline'
                  }`}
                  onPress={() => setSelectedExerciseId(exercise.id)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? 'text-on-primary' : 'text-ink'
                    }`}
                  >
                    {exercise.name}
                  </Text>
                  {isConfigured ? (
                    <View
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? 'bg-surface' : 'bg-primary'
                      }`}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Rule Editor Card */}
        {selectedExercise ? (
          <View className="rounded-xl bg-surface p-4 gap-4">
            <View className="flex-row items-center justify-between border-b border-outline pb-3">
              <View className="flex-1 pr-2">
                <Text className="text-xs font-bold uppercase tracking-wider text-muted">
                  Configuring Exercise
                </Text>
                <Text className="text-lg font-bold text-ink" numberOfLines={1}>
                  {selectedExercise.name}
                </Text>
              </View>
              {isSelectedConfigured ? (
                <View className="rounded-full bg-primary-soft px-3 py-1">
                  <Text className="text-xs font-semibold text-primary">
                    Custom Active
                  </Text>
                </View>
              ) : (
                <View className="rounded-full bg-surface px-3 py-1">
                  <Text className="text-xs font-semibold text-muted">
                    Default (12 reps / +5)
                  </Text>
                </View>
              )}
            </View>

            {/* Trigger Reps Controls */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-ink">
                Trigger reps
              </Text>
              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityLabel="Decrease trigger reps"
                  className="h-12 w-12 items-center justify-center rounded-xl bg-canvas border border-outline"
                  onPress={() => handleStepReps(-1)}
                >
                  <Minus color={muted} size={18} />
                </Pressable>
                <TextInput
                  className="min-h-12 flex-1 rounded-xl bg-canvas px-4 text-center text-lg font-semibold text-ink border border-outline"
                  keyboardType="number-pad"
                  onChangeText={setTriggerReps}
                  placeholderTextColor={muted}
                  value={triggerReps}
                />
                <Pressable
                  accessibilityLabel="Increase trigger reps"
                  className="h-12 w-12 items-center justify-center rounded-xl bg-canvas border border-outline"
                  onPress={() => handleStepReps(1)}
                >
                  <Plus color={muted} size={18} />
                </Pressable>
              </View>
              {/* Preset Chips */}
              <View className="flex-row gap-2">
                {repPresets.map((reps) => (
                  <Pressable
                    key={reps}
                    accessibilityLabel={`Set ${reps} reps`}
                    className={`flex-1 rounded-lg py-1.5 items-center justify-center border ${
                      triggerReps === String(reps)
                        ? 'border-primary bg-primary-soft'
                        : 'bg-canvas border-outline'
                    }`}
                    onPress={() => setTriggerReps(String(reps))}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        triggerReps === String(reps)
                          ? 'text-primary'
                          : 'text-muted'
                      }`}
                    >
                      {reps} reps
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Weight Increase Controls */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-ink">
                Weight increase ({weightUnit})
              </Text>
              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityLabel="Decrease weight increase"
                  className="h-12 w-12 items-center justify-center rounded-xl bg-canvas border border-outline"
                  onPress={() =>
                    handleStepIncrease(weightUnit === 'kg' ? -0.5 : -1)
                  }
                >
                  <Minus color={muted} size={18} />
                </Pressable>
                <TextInput
                  className="min-h-12 flex-1 rounded-xl bg-canvas px-4 text-center text-lg font-semibold text-ink border border-outline"
                  keyboardType="decimal-pad"
                  onChangeText={setIncreaseBy}
                  placeholderTextColor={muted}
                  value={increaseBy}
                />
                <Pressable
                  accessibilityLabel="Increase weight increase"
                  className="h-12 w-12 items-center justify-center rounded-xl bg-canvas border border-outline"
                  onPress={() =>
                    handleStepIncrease(weightUnit === 'kg' ? 0.5 : 1)
                  }
                >
                  <Plus color={muted} size={18} />
                </Pressable>
              </View>
              {/* Preset Chips */}
              <View className="flex-row gap-2">
                {weightPresets.map((val) => (
                  <Pressable
                    key={val}
                    accessibilityLabel={`Set ${val} ${weightUnit} increase`}
                    className={`flex-1 rounded-lg py-1.5 items-center justify-center border ${
                      increaseBy === String(val)
                        ? 'border-primary bg-primary-soft'
                        : 'bg-canvas border-outline'
                    }`}
                    onPress={() => setIncreaseBy(String(val))}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        increaseBy === String(val)
                          ? 'text-primary'
                          : 'text-muted'
                      }`}
                    >
                      +{val} {weightUnit}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Live Contextual Preview */}
            <View className="rounded-xl bg-canvas p-3.5 border border-outline">
              <Text className="text-sm leading-5 text-ink">
                ⚡ <Text className="font-semibold">Rule Preview:</Text>{' '}
                Completing{' '}
                <Text className="font-bold text-primary">
                  {triggerReps || '12'} reps
                </Text>{' '}
                on{' '}
                <Text className="font-bold text-ink">
                  {selectedExercise.name}
                </Text>{' '}
                will auto-increase next set weight by{' '}
                <Text className="font-bold text-primary">
                  +{increaseBy || '5'} {weightUnit}
                </Text>
                .
              </Text>
            </View>

            {/* Primary Action Button */}
            <PrimaryButton
              label={`Save rule for ${selectedExercise.name}`}
              onPress={saveOverload}
            />
          </View>
        ) : null}

        {error ? <FeedbackBanner message={error} tone="error" /> : null}
        {feedback ? <FeedbackBanner message={feedback} /> : null}

        {/* Overview of All Configured Overload Rules */}
        {configuredRules.length > 0 ? (
          <View className="mt-2 gap-3">
            <Text className="text-base font-bold text-ink">
              Configured rules ({configuredRules.length})
            </Text>
            {configuredRules.map(
              ({ setting, exercise, triggerReps: reps, increaseBy: inc }) => (
                <View
                  key={setting.id}
                  className="flex-row items-center justify-between rounded-xl bg-surface p-3.5 border border-outline"
                >
                  <Pressable
                    accessibilityLabel={`Edit rule for ${exercise.name}`}
                    className="flex-1 pr-3"
                    onPress={() => setSelectedExerciseId(exercise.id)}
                  >
                    <Text className="text-base font-semibold text-ink">
                      {exercise.name}
                    </Text>
                    <Text className="mt-0.5 text-sm text-muted">
                      Trigger:{' '}
                      <Text className="font-semibold text-primary">
                        {reps} reps
                      </Text>{' '}
                      → Increase:{' '}
                      <Text className="font-semibold text-primary">
                        +{inc} {weightUnit}
                      </Text>
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Reset rule for ${exercise.name}`}
                    className="h-10 w-10 items-center justify-center rounded-lg bg-canvas border border-outline"
                    onPress={() => deleteOverload(exercise.id)}
                  >
                    <Trash2 color={muted} size={18} />
                  </Pressable>
                </View>
              ),
            )}
          </View>
        ) : null}
      </View>

      <View className="mt-6 flex-row items-center gap-2 rounded-xl bg-surface px-3 py-2.5">
        <Info color={muted} size={14} />
        <Text className="min-w-0 flex-1 text-xs font-semibold leading-4 text-muted">
          All training data lives on this device. Health records are only read
          while Fitness Goal is open, and sync is optional.
        </Text>
      </View>
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
