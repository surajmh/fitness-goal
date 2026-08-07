import { Pressable, Text } from '../primitives';
import type { TextButtonProps } from './text-button.types';

export function TextButton({ label, onPress, destructive }: TextButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-12 items-center justify-center rounded-xl px-4 active:bg-surface"
      onPress={onPress}
    >
      <Text
        className={`text-base font-semibold ${
          destructive ? 'text-danger' : 'text-primary'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
