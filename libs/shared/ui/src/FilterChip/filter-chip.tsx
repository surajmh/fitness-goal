import { Check } from '../icons';
import { Pressable, Text, useCSSVariable } from '../primitives';
import type { FilterChipProps } from './filter-chip.types';

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const onPrimary = useCSSVariable('--on-primary') as string;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`min-h-12 flex-row items-center gap-1.5 rounded-full px-4 ${
        selected ? 'bg-primary' : 'bg-surface'
      }`}
      onPress={onPress}
    >
      {selected ? <Check color={onPrimary} size={15} strokeWidth={3} /> : null}
      <Text
        className={`text-sm font-semibold ${
          selected ? 'text-on-primary' : 'text-ink'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
