import { Text, View } from '../primitives';
import type { StatTileProps } from './stat-tile.types';

/** `text-*` utility for each data role, shared with the charts. */
export const ROLE_TEXT = {
  coral: 'text-coral',
  lime: 'text-lime',
  cyan: 'text-cyan',
  recovery: 'text-recovery',
} as const;

export function StatTile({ label, value, caption, role }: StatTileProps) {
  return (
    <View
      accessibilityLabel={`${label}: ${value} ${caption}`}
      className="flex-1 rounded-2xl bg-surface p-3"
    >
      <Text className="text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </Text>
      <Text
        className={`mt-1.5 text-2xl font-bold tabular-nums ${ROLE_TEXT[role]}`}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text className="text-[11px] font-semibold text-muted" numberOfLines={1}>
        {caption}
      </Text>
    </View>
  );
}
