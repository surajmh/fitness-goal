import { Text } from '../primitives';

export function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      accessibilityRole="header"
      className="text-[11px] font-bold uppercase tracking-wider text-muted"
    >
      {label}
    </Text>
  );
}
