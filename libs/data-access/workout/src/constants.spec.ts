import { estimatePlanMinutes, isPlanDifficulty } from './constants';

describe('estimatePlanMinutes', () => {
  it('scales with set count and the lifter’s own rest setting', () => {
    // 18 sets × (120s rest + 45s work) = 49.5 min, rounded to the nearest five.
    expect(estimatePlanMinutes(18, 120)).toBe(50);
    expect(estimatePlanMinutes(18, 90)).toBe(40);
  });

  it('is zero for an empty plan and never rounds a real one to nothing', () => {
    expect(estimatePlanMinutes(0, 90)).toBe(0);
    expect(estimatePlanMinutes(1, 15)).toBe(5);
  });
});

describe('isPlanDifficulty', () => {
  it('accepts the three levels and nothing else', () => {
    expect(isPlanDifficulty('beginner')).toBe(true);
    expect(isPlanDifficulty('advanced')).toBe(true);
    expect(isPlanDifficulty('')).toBe(false);
    expect(isPlanDifficulty('Beginner')).toBe(false);
  });
});
