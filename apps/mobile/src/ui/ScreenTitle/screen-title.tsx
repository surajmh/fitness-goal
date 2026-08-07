import { Platform } from 'react-native';
import { Text, View } from '../primitives';
import type { ScreenTitleProps } from './screen-title.types';

export function ScreenTitle({ title, subtitle }: ScreenTitleProps) {
  return (
    <View className="mb-5">
      <Text
        accessibilityRole="header"
        className={`${Platform.OS === 'ios' ? 'text-4xl' : 'text-3xl'} font-bold tracking-tight text-ink`}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-base leading-6 text-muted">{subtitle}</Text>
      ) : null}
    </View>
  );
}
