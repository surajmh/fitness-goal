import React from 'react';
import { Text, View } from '../primitives';
import type { EmptyStateProps } from './empty-state.types';

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <View className="items-start rounded-xl bg-surface p-5">
      <Text className="text-lg font-semibold text-ink">{title}</Text>
      <Text className="mt-1.5 text-base leading-6 text-muted">{message}</Text>
      {action ? <View className="mt-4">{action}</View> : null}
    </View>
  );
}
