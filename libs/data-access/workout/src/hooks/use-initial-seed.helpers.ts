import { isPlanDifficulty, type PlanDifficulty } from '../constants';

/**
 * Difficulty used to live in the plan name as a "Beginner · " prefix. Installs
 * that seeded before the column existed still carry it there, so split it back
 * out once. Returns undefined when there is nothing to migrate — a name the
 * user wrote themselves is left exactly as they wrote it.
 */
export function splitLegacyPlanName(
  name: string,
): { name: string; difficulty: PlanDifficulty } | undefined {
  const [prefix, ...rest] = name.split(' · ');
  const difficulty = prefix.toLowerCase();
  if (!rest.length || !isPlanDifficulty(difficulty)) return undefined;
  return { name: rest.join(' · '), difficulty };
}

/**
 * A seeded (non-custom) exercise with no image is safe to prune only when no
 * plan or logged workout references it — deleting a referenced one would orphan
 * that history.
 */
export function isImagelessOrphan(
  exercise: { id: string; isCustom: boolean; mediaFrames: string[] },
  referencedIds: Set<string>,
): boolean {
  return (
    !exercise.isCustom &&
    exercise.mediaFrames.length === 0 &&
    !referencedIds.has(exercise.id)
  );
}
