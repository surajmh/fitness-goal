/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  Check,
  EmptyState,
  ExerciseArtwork,
  Filter,
  FilterChip,
  Pressable,
  Row,
  ScrollView,
  SearchField,
  Text,
  TextButton,
  useCSSVariable,
  View,
  X,
} from '@fitnessgoal/shared/ui';
import { database, Exercise } from '@fitnessgoal/data-access/workout';
import { EQUIPMENT_OPTIONS, MUSCLE_OPTIONS } from './exercise-picker.constants';
import type { ExercisePickerProps } from './exercise-picker.types';
import { formatFilterLabel } from './exercise-picker.helpers';
import { useExercisePicker } from './use-exercise-picker';

function ExercisePickerBase({
  exercises,
  selectedIds,
  onToggle,
}: ExercisePickerProps) {
  const onPrimary = useCSSVariable('--on-primary') as string;
  const muted = useCSSVariable('--muted') as string;
  const primary = useCSSVariable('--primary') as string;
  const {
    query,
    setQuery,
    muscle,
    setMuscle,
    equipment,
    setEquipment,
    filtered,
    visibleLimit,
    showMore,
    resetFilters,
    showFilters,
    toggleFilters,
    activeFilterCount,
  } = useExercisePicker(exercises);
  const visibleExercises = filtered.slice(0, visibleLimit);
  const selectedCount = selectedIds.length;

  return (
    <View className="gap-3">
      {/* Search Header Row with Filter Toggle Icon Button */}
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <SearchField
            onChangeText={setQuery}
            placeholder="Search exercise by name..."
            value={query}
          />
        </View>
        <Pressable
          accessibilityLabel="Toggle exercise filters"
          className={`h-12 w-12 items-center justify-center rounded-xl border relative ${
            showFilters || activeFilterCount > 0
              ? 'bg-primary/10 border-primary'
              : 'bg-surface border-outline'
          }`}
          onPress={toggleFilters}
        >
          <Filter
            color={showFilters || activeFilterCount > 0 ? primary : muted}
            size={20}
          />
          {activeFilterCount > 0 ? (
            <View className="absolute -top-1 -right-1 h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1">
              <Text className="text-xs font-bold text-surface">
                {activeFilterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {/* Active Filter Quick Badges Strip (when filters are active and panel is closed) */}
      {activeFilterCount > 0 && !showFilters ? (
        <View className="flex-row flex-wrap items-center gap-2">
          {muscle !== 'all' ? (
            <Pressable
              accessibilityLabel="Remove muscle filter"
              className="flex-row items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-3 py-1"
              onPress={() => setMuscle('all')}
            >
              <Text className="text-xs font-semibold text-primary">
                Muscle: {formatFilterLabel(muscle)}
              </Text>
              <X color={primary} size={14} />
            </Pressable>
          ) : null}
          {equipment !== 'all' ? (
            <Pressable
              accessibilityLabel="Remove equipment filter"
              className="flex-row items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-3 py-1"
              onPress={() => setEquipment('all')}
            >
              <Text className="text-xs font-semibold text-primary">
                Equipment: {formatFilterLabel(equipment)}
              </Text>
              <X color={primary} size={14} />
            </Pressable>
          ) : null}
          <TextButton label="Clear all" onPress={resetFilters} />
        </View>
      ) : null}

      {/* Collapsible Filter Panel */}
      {showFilters ? (
        <View className="rounded-xl bg-surface p-4 border border-outline gap-3">
          <View className="flex-row items-center justify-between border-b border-outline pb-2.5">
            <Text className="text-base font-bold text-ink">Filter Options</Text>
            <View className="flex-row items-center gap-3">
              {activeFilterCount > 0 ? (
                <TextButton label="Reset filters" onPress={resetFilters} />
              ) : null}
              <Pressable
                accessibilityLabel="Close filters"
                className="h-8 w-8 items-center justify-center rounded-lg bg-background"
                onPress={toggleFilters}
              >
                <X color={muted} size={16} />
              </Pressable>
            </View>
          </View>

          {/* Muscle Group Filters */}
          <View className="gap-1.5">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted">
              Muscle Group
            </Text>
            <ScrollView
              className="-mx-4"
              contentContainerClassName="gap-2 px-4"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {MUSCLE_OPTIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item === 'all' ? 'All muscles' : formatFilterLabel(item)}
                  onPress={() => setMuscle(item)}
                  selected={muscle === item}
                />
              ))}
            </ScrollView>
          </View>

          {/* Equipment Filters */}
          <View className="gap-1.5">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted">
              Equipment
            </Text>
            <ScrollView
              className="-mx-4"
              contentContainerClassName="gap-2 px-4"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {EQUIPMENT_OPTIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item === 'all' ? 'All equipment' : formatFilterLabel(item)}
                  onPress={() => setEquipment(item)}
                  selected={equipment === item}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      ) : null}

      {/* Results Header & Selection Status Badge */}
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted">
          {filtered.length.toLocaleString()}{' '}
          {filtered.length === 1 ? 'exercise' : 'exercises'} found
        </Text>
        <View className="flex-row items-center gap-2">
          {selectedCount > 0 ? (
            <View className="rounded-full bg-primary/15 px-3 py-1">
              <Text className="text-xs font-bold text-primary">
                {selectedCount} selected
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Exercise Cards Container */}
      <View className="rounded-xl bg-surface px-4">
        {!filtered.length ? (
          <View className="py-6">
            <EmptyState
              message="No exercises match your search criteria. Try adjusting or resetting your filters."
              title="No exercises found"
            />
            <View className="mt-3 items-center">
              <TextButton label="Clear all filters" onPress={resetFilters} />
            </View>
          </View>
        ) : null}

        {visibleExercises.map((exercise, index) => {
          const selected = selectedIds.includes(exercise.id);
          const isLast = index === visibleExercises.length - 1;
          return (
            <Row
              key={exercise.id}
              border={!isLast}
              leading={<ExerciseArtwork compact exercise={exercise} />}
              onPress={() => onToggle(exercise.id)}
              subtitle={`${formatFilterLabel(exercise.muscleGroup)} · ${formatFilterLabel(
                exercise.equipment,
              )}`}
              title={exercise.name}
              trailing={
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full border ${
                    selected
                      ? 'bg-primary border-primary'
                      : 'border-outline bg-background'
                  }`}
                >
                  {selected ? (
                    <Check color={onPrimary} size={16} strokeWidth={3} />
                  ) : null}
                </View>
              }
            />
          );
        })}
      </View>

      {/* Load More Button */}
      {visibleExercises.length < filtered.length ? (
        <Pressable
          accessibilityRole="button"
          className="mt-1 min-h-12 items-center justify-center rounded-xl bg-surface border border-outline active:bg-surface-raised"
          onPress={showMore}
        >
          <Text className="font-semibold text-primary">
            Showing {visibleExercises.length} of {filtered.length} · Show more
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const ExercisePicker = withObservables([], () => ({
  exercises: database
    .get<Exercise>('exercises')
    .query(Q.sortBy('name', Q.asc))
    .observe(),
}))(ExercisePickerBase as any) as React.ComponentType<{
  selectedIds: string[];
  onToggle: (id: string) => void;
}>;
