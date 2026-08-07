import { Alert } from 'react-native';
import { Check, Ellipsis } from '../../ui/icons';
import { toggleSetComplete } from '../../database/workout-service';
import {
  Pressable,
  Text,
  TextInput,
  useCSSVariable,
  View,
} from '../../ui/primitives';
import type { SetEditorProps } from './set-editor.types';
import { useSetEditor } from './use-set-editor';

export function SetEditor({
  item,
  unit,
  onCompleted,
  previous,
  onDuplicate,
  onRemove,
}: SetEditorProps) {
  const { weight, setWeight, reps, setReps, rpe, setRpe, error, save } =
    useSetEditor(item);
  const ink = useCSSVariable('--ink') as string;
  const muted = useCSSVariable('--muted') as string;
  return (
    <View className="border-b border-outline py-2">
      <View className="min-h-14 flex-row items-center gap-2">
        <Text className="w-8 text-center font-semibold text-muted">
          {item.setNumber}
        </Text>
        <View className="flex-1">
          <TextInput
            accessibilityLabel={`Set ${item.setNumber} weight in ${unit}`}
            className="min-h-12 rounded-lg bg-canvas px-3 text-center text-base font-semibold text-ink"
            keyboardType="decimal-pad"
            onBlur={save}
            onChangeText={setWeight}
            placeholder="—"
            placeholderTextColor={muted}
            selectTextOnFocus
            value={weight}
          />
        </View>
        <View className="flex-1">
          <TextInput
            accessibilityLabel={`Set ${item.setNumber} repetitions`}
            className="min-h-12 rounded-lg bg-canvas px-3 text-center text-base font-semibold text-ink"
            keyboardType="number-pad"
            onBlur={save}
            onChangeText={setReps}
            placeholder="—"
            placeholderTextColor={muted}
            selectTextOnFocus
            value={reps}
          />
        </View>
        <View className="w-14">
          <TextInput
            accessibilityLabel={`Set ${item.setNumber} RPE`}
            className="min-h-12 rounded-lg bg-canvas px-2 text-center text-base font-semibold text-ink"
            keyboardType="decimal-pad"
            onBlur={save}
            onChangeText={setRpe}
            placeholder="—"
            placeholderTextColor={muted}
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
            item.isCompleted ? 'bg-success' : 'bg-canvas'
          }`}
          onPress={async () => {
            const wasCompleted = item.isCompleted;
            if (!(await save())) return;
            await toggleSetComplete(item);
            if (!wasCompleted) onCompleted();
          }}
        >
          <Check
            color={item.isCompleted ? 'white' : ink}
            size={22}
            strokeWidth={3}
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
        <Text className="ml-10 mt-1 text-xs text-muted">
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
