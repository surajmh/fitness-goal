import { useState } from 'react';
import { Alert } from 'react-native';
import {
  ArrowUp,
  Check,
  Ellipsis,
  Pressable,
  Text,
  TextInput,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import { toggleSetComplete } from '@fitnessgoal/data-access/workout';
import { fieldClassName } from './set-editor.helpers';
import type { SetEditorProps } from './set-editor.types';
import { useSetEditor } from './use-set-editor';

export function SetEditor({
  item,
  isActive,
  isPersonalRecord,
  unit,
  onCompleted,
  previous,
  onDuplicate,
  onRemove,
}: SetEditorProps) {
  const { weight, setWeight, reps, setReps, rpe, setRpe, error, save } =
    useSetEditor(item);
  const [focused, setFocused] = useState('');
  const canvas = useCSSVariable('--canvas') as string;
  const muted = useCSSVariable('--muted') as string;
  const onPrimary = useCSSVariable('--on-primary') as string;
  const placeholderInk = useCSSVariable('--placeholder-ink') as string;

  const field = (name: string, value: string) =>
    fieldClassName({
      completed: item.isCompleted,
      focused: focused === name,
      empty: !value,
    });

  return (
    <View
      className={`mt-1.5 px-2 py-1.5 ${
        isActive ? 'rounded-2xl bg-surface' : ''
      }`}
    >
      <View className="min-h-14 flex-row items-center gap-2">
        <Text
          className={`w-8 text-center tabular-nums ${
            isActive ? 'font-extrabold text-ink' : 'font-semibold text-muted'
          }`}
        >
          {item.setNumber}
        </Text>
        <View className="flex-1">
          <TextInput
            accessibilityLabel={`Set ${item.setNumber} weight in ${unit}${
              isPersonalRecord ? ', personal record' : ''
            }`}
            className={`${field('weight', weight)}${isPersonalRecord ? ' pr-14' : ''}`}
            keyboardType="decimal-pad"
            onBlur={() => {
              setFocused('');
              return save();
            }}
            onChangeText={setWeight}
            onFocus={() => setFocused('weight')}
            placeholder="—"
            placeholderTextColor={placeholderInk}
            selectTextOnFocus
            value={weight}
          />
          {isPersonalRecord ? (
            <View
              className="absolute inset-y-0 right-2 justify-center"
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
            >
              {/* Never colour alone: the badge carries the arrow and the letters. */}
              <View className="h-[22px] flex-row items-center gap-0.5 rounded-md bg-primary px-1.5">
                <ArrowUp color={onPrimary} size={10} strokeWidth={3} />
                <Text className="text-[11px] font-extrabold text-on-primary">
                  PR
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View className="flex-1">
          <TextInput
            accessibilityLabel={`Set ${item.setNumber} repetitions`}
            className={field('reps', reps)}
            keyboardType="number-pad"
            onBlur={() => {
              setFocused('');
              return save();
            }}
            onChangeText={setReps}
            onFocus={() => setFocused('reps')}
            placeholder="—"
            placeholderTextColor={placeholderInk}
            selectTextOnFocus
            value={reps}
          />
        </View>
        <View className="w-14">
          <TextInput
            accessibilityLabel={`Set ${item.setNumber} RPE`}
            className={`${field('rpe', rpe)} text-center`}
            keyboardType="decimal-pad"
            onBlur={() => {
              setFocused('');
              return save();
            }}
            onChangeText={setRpe}
            onFocus={() => setFocused('rpe')}
            placeholder="—"
            placeholderTextColor={placeholderInk}
            selectTextOnFocus
            value={rpe}
          />
        </View>
        <Pressable
          accessibilityLabel={
            item.isCompleted
              ? `Mark set ${item.setNumber} incomplete`
              : `Complete set ${item.setNumber}`
          }
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.isCompleted }}
          className={`h-12 w-12 items-center justify-center rounded-xl ${
            item.isCompleted
              ? 'bg-success'
              : weight || reps
                ? 'border-2 border-outline'
                : 'border border-dashed border-outline'
          }`}
          onPress={async () => {
            const wasCompleted = item.isCompleted;
            if (!(await save())) return;
            await toggleSetComplete(item);
            if (!wasCompleted) onCompleted();
          }}
        >
          <Check
            color={
              item.isCompleted
                ? canvas
                : weight || reps
                  ? muted
                  : placeholderInk
            }
            size={22}
            strokeWidth={item.isCompleted ? 2.6 : 2.2}
          />
        </Pressable>
        <Pressable
          accessibilityLabel={`Set ${item.setNumber} actions`}
          className="h-12 w-12 items-center justify-center"
          onPress={() =>
            Alert.alert(`Set ${item.setNumber}`, undefined, [
              { text: 'Duplicate set', onPress: onDuplicate },
              { text: 'Delete set', style: 'destructive', onPress: onRemove },
              { text: 'Cancel', style: 'cancel' },
            ])
          }
        >
          <Ellipsis color={muted} size={22} />
        </Pressable>
      </View>
      {previous ? (
        <Text className="ml-10 mt-1 text-xs tabular-nums text-muted">
          Previous: {previous.weight ?? '—'} {unit} × {previous.reps ?? '—'}
          {previous.rpe ? ` · RPE ${previous.rpe}` : ''}
        </Text>
      ) : null}
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          className="ml-10 mt-1 text-xs font-semibold text-danger"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
