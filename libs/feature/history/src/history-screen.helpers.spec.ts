import {
  buildWeeklyVolume,
  formatHistorySpan,
  formatSetPerformance,
  formatWorkoutDuration,
  getSessionSummary,
  groupSessionsByWeek,
  summarizeSessions,
} from './history-screen.helpers';

const NOW = new Date('2026-08-08T09:00:00Z');
const daysAgo = (days: number) => NOW.getTime() - days * 86_400_000;

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

describe('buildWeeklyVolume', () => {
  it('buckets volume into seven weeks, oldest first, and drops the rest', () => {
    const weeks = buildWeeklyVolume(
      [
        { weight: 10, reps: 10, createdAt: new Date(daysAgo(1)) },
        { weight: 20, reps: 10, createdAt: new Date(daysAgo(8)) },
        { weight: 99, reps: 10, createdAt: new Date(daysAgo(400)) },
      ] as never,
      7,
      NOW,
    );
    expect(weeks).toHaveLength(7);
    expect(weeks[6]).toBe(100);
    expect(weeks[5]).toBe(200);
    expect(weeks.reduce((total, value) => total + value, 0)).toBe(300);
  });
});

describe('groupSessionsByWeek', () => {
  it('runs consecutive sessions under one heading', () => {
    const groups = groupSessionsByWeek(
      [
        { startTime: daysAgo(1) },
        { startTime: daysAgo(3) },
        { startTime: daysAgo(9) },
      ] as never,
      NOW,
    );
    expect(groups.map((group) => group.label)).toEqual([
      'This week',
      'Last week',
    ]);
    expect(groups[0].sessions).toHaveLength(2);
  });
});

describe('summarizeSessions', () => {
  it('totals volume and set count per session', () => {
    const totals = summarizeSessions([
      { sessionId: 'one', weight: 10, reps: 5 },
      { sessionId: 'one', weight: 10, reps: 5 },
      { sessionId: 'two', weight: 20, reps: 5 },
    ] as never);
    expect(totals.get('one')).toEqual({ volume: 100, setCount: 2 });
    expect(totals.get('two')).toEqual({ volume: 100, setCount: 1 });
  });
});

describe('formatHistorySpan', () => {
  it('pairs the session count with the span it covers', () => {
    expect(formatHistorySpan([{ startTime: daysAgo(90) }] as never, NOW)).toBe(
      '1 session · 3 months',
    );
    expect(formatHistorySpan([], NOW)).toBe('Nothing logged yet');
  });
});
