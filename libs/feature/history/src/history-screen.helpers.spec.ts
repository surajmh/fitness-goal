import {
  formatSetPerformance,
  formatWorkoutDuration,
  getSessionSummary,
} from './history-screen.helpers';

describe('getSessionSummary', () => {
  it('groups only sets from the selected session', () => {
    const result = getSessionSummary(
      [
        { sessionId: 'one', exerciseId: 'bench', weight: 10, reps: 5 },
        { sessionId: 'two', exerciseId: 'bench', weight: 20, reps: 5 },
      ] as never,
      'one',
    );
    expect(result.sessionSets).toHaveLength(1);
    expect(result.volume).toBe(50);
  });

  it('formats short and long workout durations', () => {
    expect(formatWorkoutDuration(0, 45 * 60000)).toBe('45 min');
    expect(formatWorkoutDuration(0, 75 * 60000)).toBe('1 hr 15 min');
    expect(formatWorkoutDuration(1000)).toBe('—');
  });

  it('formats weighted, timed, and empty set results', () => {
    expect(formatSetPerformance({ weight: 135, reps: 8 } as never, 'lb')).toBe(
      '135 lb × 8',
    );
    expect(formatSetPerformance({ durationSeconds: 95 } as never, 'kg')).toBe(
      '1m 35s',
    );
    expect(formatSetPerformance({} as never, 'lb')).toBe('No result recorded');
    expect(
      formatSetPerformance(
        { weight: null, reps: null, durationSeconds: null } as never,
        'lb',
      ),
    ).toBe('No result recorded');
  });
});
