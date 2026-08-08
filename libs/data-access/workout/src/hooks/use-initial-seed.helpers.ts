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
