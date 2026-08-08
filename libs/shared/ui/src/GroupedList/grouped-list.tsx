import React from 'react';
import { View } from '../primitives';
import type { GroupedListProps } from './grouped-list.types';

export function GroupedList({
  children,
  inset = 0,
  surface = false,
}: GroupedListProps) {
  // toArray drops the nulls that conditional rows leave behind, so a hidden
  // row never leaves a stray divider.
  const rows = React.Children.toArray(children);

  return (
    <View
      className={
        surface ? 'overflow-hidden rounded-2xl bg-surface px-3.5' : undefined
      }
    >
      {rows.map((row, index) => (
        <React.Fragment key={(row as React.ReactElement).key}>
          {index ? (
            <View className="h-px bg-outline" style={{ marginLeft: inset }} />
          ) : null}
          {row}
        </React.Fragment>
      ))}
    </View>
  );
}
