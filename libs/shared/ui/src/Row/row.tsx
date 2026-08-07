import React from 'react';
import { ChevronRight } from '../icons';
import { Pressable, Text, useCSSVariable, View } from '../primitives';
import type { RowProps } from './row.types';

export function Row({ title, subtitle, onPress, leading, trailing }: RowProps) {
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
      {trailing ?? (onPress ? <ChevronRight color={muted} size={20} /> : null)}
    </>
  );

  return onPress ? (
    <Pressable
      accessibilityRole="button"
      className="min-h-14 flex-row items-center gap-3 border-b border-outline active:bg-surface"
      onPress={onPress}
    >
      {content}
    </Pressable>
  ) : (
    <View className="min-h-14 flex-row items-center gap-3 border-b border-outline">
      {content}
    </View>
  );
}
