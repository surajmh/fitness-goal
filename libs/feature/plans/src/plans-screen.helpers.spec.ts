import {
  countPlanSets,
  groupPlansByDifficulty,
  hasInvalidTargets,
  moveSelectedExercise,
} from './plans-screen.helpers';

describe('moveSelectedExercise', () => {
  it('swaps neighbours and refuses to run off either end', () => {
    expect(moveSelectedExercise(['a', 'b', 'c'], 1, -1)).toEqual([
      'b',
      'a',
      'c',
    ]);
    expect(moveSelectedExercise(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
    expect(moveSelectedExercise(['a', 'b'], 1, 1)).toEqual(['a', 'b']);
  });
});

describe('hasInvalidTargets', () => {
  it('rejects missing, zero, and non-numeric targets', () => {
    expect(hasInvalidTargets(['a'], { a: { sets: '3', reps: '8' } })).toBe(
      false,
    );
    expect(hasInvalidTargets(['a'], {})).toBe(true);
    expect(hasInvalidTargets(['a'], { a: { sets: '0', reps: '8' } })).toBe(
      true,
    );
    expect(hasInvalidTargets(['a'], { a: { sets: '3', reps: 'x' } })).toBe(
      true,
    );
  });
});

describe('groupPlansByDifficulty', () => {
  it('orders the levels and drops the empty ones', () => {
    const groups = groupPlansByDifficulty([
      { id: '1', difficulty: 'advanced' },
      { id: '2', difficulty: 'beginner' },
      { id: '3', difficulty: 'beginner' },
    ] as never);
    expect(groups.map((group) => group.label)).toEqual([
      'Beginner',
      'Advanced',
    ]);
    expect(groups[0].plans).toHaveLength(2);
  });

  it('collects plans with no level rather than guessing one', () => {
    const groups = groupPlansByDifficulty([
      { id: '1', difficulty: '' },
      { id: '2', difficulty: 'beginner' },
    ] as never);
    expect(groups.map((group) => group.label)).toEqual([
      'Beginner',
      'My plans',
    ]);
  });
});

describe('countPlanSets', () => {
  it('totals target sets for one plan only', () => {
    const entries = [
      { planId: 'a', targetSets: 3 },
      { planId: 'a', targetSets: 4 },
      { planId: 'b', targetSets: 9 },
    ] as never;
    expect(countPlanSets(entries, 'a')).toBe(7);
  });
});
