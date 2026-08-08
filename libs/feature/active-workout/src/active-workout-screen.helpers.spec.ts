import {
  findPersonalRecordIds,
  summarizeWorkout,
} from './active-workout-screen.helpers';

describe('summarizeWorkout', () => {
  it('only includes completed sets in volume', () => {
    const summary = summarizeWorkout([
      { isCompleted: true, weight: 50, reps: 10, updatedAt: new Date(2) },
      { isCompleted: false, weight: 100, reps: 10, updatedAt: new Date(1) },
    ] as never);
    expect(summary.completed).toBe(1);
    expect(summary.volume).toBe(500);
  });
});

describe('findPersonalRecordIds', () => {
  const history = [{ exerciseId: 'bench', weight: 80 }] as never;

  it('badges only the top set of a ramp-up that beats history', () => {
    const records = findPersonalRecordIds(
      [
        { id: 'a', exerciseId: 'bench', weight: 75, isCompleted: true },
        { id: 'b', exerciseId: 'bench', weight: 82.5, isCompleted: true },
        { id: 'c', exerciseId: 'bench', weight: 81, isCompleted: true },
      ] as never,
      history,
    );
    expect([...records]).toEqual(['b']);
  });

  it('ignores incomplete sets and exercises with no history', () => {
    const records = findPersonalRecordIds(
      [
        { id: 'a', exerciseId: 'bench', weight: 200, isCompleted: false },
        { id: 'b', exerciseId: 'squat', weight: 200, isCompleted: true },
      ] as never,
      history,
    );
    expect(records.size).toBe(0);
  });
});
