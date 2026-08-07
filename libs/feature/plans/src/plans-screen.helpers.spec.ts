import {
  hasInvalidTargets,
  moveSelectedExercise,
} from './plans-screen.helpers';

describe('plan helpers', () => {
  it('moves exercises without mutating input', () => {
    const ids = ['a', 'b'];
    expect(moveSelectedExercise(ids, 1, -1)).toEqual(['b', 'a']);
    expect(ids).toEqual(['a', 'b']);
  });
  it('requires positive targets', () => {
    expect(hasInvalidTargets(['a'], { a: { sets: '0', reps: '8' } })).toBe(
      true,
    );
    expect(hasInvalidTargets(['a'], { a: { sets: 'three', reps: '8' } })).toBe(
      true,
    );
    expect(hasInvalidTargets(['a'], { a: { sets: '3', reps: '8' } })).toBe(
      false,
    );
  });
});
