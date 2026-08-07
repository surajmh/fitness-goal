/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { Check } from '../../ui/icons';
import { database, Exercise } from '../../database';
import { EmptyState } from '../../ui/EmptyState';
import { FilterChip } from '../../ui/FilterChip';
import { Row } from '../../ui/Row';
import { SearchField } from '../../ui/SearchField';
import {
  Pressable,
  ScrollView,
  Text,
  useCSSVariable,
  View,
} from '../../ui/primitives';
import { ExerciseArtwork } from '../shared/screen-shared';
import { EQUIPMENT_OPTIONS, MUSCLE_OPTIONS } from './exercise-picker.constants';
import type { ExercisePickerProps } from './exercise-picker.types';
import { useExercisePicker } from './use-exercise-picker';

function ExercisePickerBase({
  exercises,
  selectedIds,
  onToggle,
}: ExercisePickerProps) {
  const onPrimary = useCSSVariable('--on-primary') as string;
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
  } = useExercisePicker(exercises);
  const visibleExercises = filtered.slice(0, visibleLimit);

  return (
    <View>
      <SearchField onChangeText={setQuery} value={query} />
      <ScrollView
        className="-mx-5 mt-3"
        contentContainerClassName="gap-2 px-5"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {MUSCLE_OPTIONS.map((item) => (
          <FilterChip
            key={item}
            label={item === 'all' ? 'All areas' : item}
            onPress={() => setMuscle(item)}
            selected={muscle === item}
          />
        ))}
      </ScrollView>
      <ScrollView
        className="-mx-5 mt-2"
        contentContainerClassName="gap-2 px-5"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {EQUIPMENT_OPTIONS.map((item) => (
          <FilterChip
            key={item}
            label={item === 'all' ? 'All equipment' : item}
            onPress={() => setEquipment(item)}
            selected={equipment === item}
          />
        ))}
      </ScrollView>
      <View className="mt-4">
        {filtered.length ? (
          <Text className="mb-1 text-sm text-muted">
            {filtered.length.toLocaleString()}{' '}
            {filtered.length === 1 ? 'exercise' : 'exercises'}
          </Text>
        ) : null}
        {!filtered.length ? (
          <EmptyState
            message="Try a broader search or clear one of the filters."
            title="No exercises match"
          />
        ) : null}
        {visibleExercises.map((exercise) => {
          const selected = selectedIds.includes(exercise.id);
          return (
            <Row
              key={exercise.id}
              leading={<ExerciseArtwork exercise={exercise} compact />}
              onPress={() => onToggle(exercise.id)}
              subtitle={`${exercise.muscleGroup} · ${exercise.equipment}`}
              title={exercise.name}
              trailing={
                <View
                  className={`h-12 w-12 items-center justify-center rounded-full ${
                    selected ? 'bg-primary' : 'border border-outline'
                  }`}
                >
                  {selected ? (
                    <Check color={onPrimary} size={17} strokeWidth={3} />
                  ) : null}
                </View>
              }
            />
          );
        })}
        {visibleExercises.length < filtered.length ? (
          <Pressable
            accessibilityRole="button"
            className="mt-2 min-h-12 items-center justify-center rounded-xl bg-surface"
            onPress={showMore}
          >
            <Text className="font-semibold text-primary">
              Show more · {filtered.length - visibleExercises.length} remaining
            </Text>
          </Pressable>
        ) : null}
      </View>
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
