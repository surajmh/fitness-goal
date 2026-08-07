import { summarizeWorkout } from './active-workout-screen.helpers';

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
