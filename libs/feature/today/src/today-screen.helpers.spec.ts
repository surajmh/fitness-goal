import {
  buildTodaySummary,
  countStreakWeeks,
  formatRelativeDay,
  planInitials,
} from './today-screen.helpers';

const NOW = new Date('2026-08-08T09:00:00Z');
const daysAgo = (days: number) => NOW.getTime() - days * 86_400_000;

describe('buildTodaySummary', () => {
  it('counts only this week towards volume and sessions', () => {
    const summary = buildTodaySummary(
      [{ startTime: daysAgo(2) }, { startTime: daysAgo(30) }] as never,
      [
        {
          isCompleted: true,
          weight: 100,
          reps: 5,
          createdAt: new Date(daysAgo(2)),
        },
        {
          isCompleted: true,
          weight: 200,
          reps: 5,
          createdAt: new Date(daysAgo(30)),
        },
        {
          isCompleted: false,
          weight: 300,
          reps: 5,
          createdAt: new Date(daysAgo(1)),
        },
      ] as never,
      NOW,
    );

    expect(summary.weekVolume).toBe(500);
    expect(summary.weekSessions).toBe(1);
  });
});

describe('countStreakWeeks', () => {
  it('counts back through consecutive weeks and stops at the gap', () => {
    const sessions = [
      { startTime: daysAgo(1) },
      { startTime: daysAgo(9) },
      { startTime: daysAgo(15) },
      { startTime: daysAgo(40) },
    ] as never;
    expect(countStreakWeeks(sessions, NOW)).toBe(3);
  });

  it('does not break the streak on an untrained current week', () => {
    const sessions = [
      { startTime: daysAgo(8) },
      { startTime: daysAgo(12) },
    ] as never;
    expect(countStreakWeeks(sessions, NOW)).toBe(1);
  });

  it('is zero with no sessions', () => {
    expect(countStreakWeeks([], NOW)).toBe(0);
  });
});

describe('planInitials', () => {
  it('takes the first letter of the first two words', () => {
    expect(planInitials('Pull B — Back & Biceps')).toBe('PB');
    expect(planInitials('Legs')).toBe('LE');
    expect(planInitials('')).toBe('··');
  });
});

describe('formatRelativeDay', () => {
  it('reads naturally across the ranges', () => {
    expect(formatRelativeDay(daysAgo(0), NOW)).toBe('today');
    expect(formatRelativeDay(daysAgo(1), NOW)).toBe('yesterday');
    expect(formatRelativeDay(daysAgo(4), NOW)).toBe('4 days ago');
    expect(formatRelativeDay(daysAgo(8), NOW)).toBe('a week ago');
    expect(formatRelativeDay(daysAgo(21), NOW)).toBe('3 weeks ago');
  });
});
