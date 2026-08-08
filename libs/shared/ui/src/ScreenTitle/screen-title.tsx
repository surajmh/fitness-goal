import { Platform } from 'react-native';
import { Text, View } from '../primitives';
import type { ScreenTitleProps } from './screen-title.types';

export function ScreenTitle({ title, subtitle, trailing }: ScreenTitleProps) {
  return (
    <View className="mb-5 flex-row items-start justify-between gap-3">
      <View className="min-w-0 flex-1">
        <Text
          accessibilityRole="header"
          className={`${Platform.OS === 'ios' ? 'text-4xl' : 'text-3xl'} font-bold tracking-tight text-ink`}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-[13px] font-medium leading-5 text-muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}
