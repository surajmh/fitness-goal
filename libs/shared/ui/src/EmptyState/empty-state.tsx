import React from 'react';
import { Dumbbell } from '../icons';
import { Text, useCSSVariable, View } from '../primitives';
import type { EmptyStateProps } from './empty-state.types';

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  const muted = useCSSVariable('--muted') as string;
  return (
    <View className="items-center rounded-2xl bg-surface p-6">
      <View className="mb-3 h-[52px] w-[52px] items-center justify-center rounded-2xl bg-surface-raised">
        {icon ?? <Dumbbell color={muted} size={26} />}
      </View>
      <Text className="text-center text-lg font-bold text-ink">{title}</Text>
      <Text className="mt-1 max-w-xs text-center text-sm leading-5 text-muted">
        {message}
      </Text>
      {action ? <View className="mt-3.5">{action}</View> : null}
    </View>
  );
}
