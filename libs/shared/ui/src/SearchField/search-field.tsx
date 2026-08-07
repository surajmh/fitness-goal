import { Search, X } from '../icons';
import { Pressable, TextInput, useCSSVariable, View } from '../primitives';
import { DEFAULT_SEARCH_PLACEHOLDER } from './search-field.constants';
import type { SearchFieldProps } from './search-field.types';

export function SearchField({
  value,
  onChangeText,
  placeholder = DEFAULT_SEARCH_PLACEHOLDER,
}: SearchFieldProps) {
  const muted = useCSSVariable('--muted') as string;
  return (
    <View className="min-h-12 flex-row items-center gap-3 rounded-xl bg-surface px-4">
      <Search color={muted} size={20} aria-hidden />
      <TextInput
        accessibilityLabel={placeholder}
        className="min-h-12 flex-1 text-base text-ink"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={muted}
        returnKeyType="search"
        value={value}
      />
      {value ? (
        <Pressable
          accessibilityLabel="Clear search"
          className="h-12 w-12 items-center justify-center"
          onPress={() => onChangeText('')}
        >
          <X color={muted} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}
