import type {
  ParsedSetValues,
  SetFieldState,
  SetValues,
} from './set-editor.types';

const FIELD_BASE =
  'min-h-12 rounded-xl px-3 text-xl font-bold tabular-nums leading-none';

/**
 * The four set-row field states from the design system: completed sets tint
 * with success-soft, the focused field takes a 2pt primary border, and an
 * untouched field stays a dashed outline so an empty row reads as "not yet".
 */
export function fieldClassName({ completed, focused, empty }: SetFieldState) {
  if (completed) return `${FIELD_BASE} bg-success-soft text-muted`;
  if (focused)
    return `${FIELD_BASE} border-2 border-primary bg-surface-raised text-ink`;
  if (empty)
    return `${FIELD_BASE} border border-dashed border-outline text-placeholder-ink`;
  return `${FIELD_BASE} border border-outline bg-surface-raised text-ink`;
}

export function parseSetValues(values: SetValues): ParsedSetValues {
  return {
    weight: values.weight ? Number(values.weight) : undefined,
    reps: values.reps ? Number(values.reps) : undefined,
    rpe: values.rpe ? Number(values.rpe) : undefined,
  };
}

export function validateSetValues(values: ParsedSetValues) {
  return !(
    (values.weight !== undefined &&
      (values.weight < 0 || values.weight > 5000)) ||
    (values.reps !== undefined && (values.reps < 0 || values.reps > 1000)) ||
    (values.rpe !== undefined && (values.rpe < 1 || values.rpe > 10))
  );
}
