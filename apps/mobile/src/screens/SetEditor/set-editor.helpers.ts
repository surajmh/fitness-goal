import type { ParsedSetValues, SetValues } from './set-editor.types';

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
