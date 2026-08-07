import { buildTodaySummary } from './today-screen.helpers';

describe('buildTodaySummary', () => {
  it('counts completed sets and calculates volume', () => {
    const summary = buildTodaySummary([], [
      { isCompleted: true, weight: 100, reps: 5 },
      { isCompleted: false, weight: 200, reps: 5 },
    ] as never);

    expect(summary.completedSetCount).toBe(1);
    expect(summary.volume).toBe(500);
  });
});
