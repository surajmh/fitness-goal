import React from 'react';
import { ChevronRight } from '../icons';
import { Pressable, Text, useCSSVariable, View } from '../primitives';
import type { RowProps } from './row.types';

export function Row({
  title,
  subtitle,
  onPress,
  leading,
  trailing,
  border = true,
}: RowProps) {
  const muted = useCSSVariable('--muted') as string;
  const content = (
    <>
      {leading}
      <View className="min-w-0 flex-1 py-3">
        <Text className="text-base font-semibold text-ink">{title}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-sm text-muted">{subtitle}</Text>
        ) : null}
      </View>
      {trailing ? (
        <View className="items-center justify-center">{trailing}</View>
      ) : onPress ? (
        <ChevronRight color={muted} size={20} />
      ) : null}
    </>
  );

  const containerClassName = `min-h-14 flex-row items-center gap-3 ${
    border ? 'border-b border-outline' : ''
  }`;

  return onPress ? (
    <Pressable
      accessibilityRole="button"
      className={`${containerClassName} active:bg-surface`}
      onPress={onPress}
    >
      {content}
    </Pressable>
  ) : (
    <View className={containerClassName}>{content}</View>
  );
}
