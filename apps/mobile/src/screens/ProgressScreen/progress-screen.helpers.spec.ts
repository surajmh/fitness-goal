import { parseBodyMetric } from './progress-screen.helpers';

describe('parseBodyMetric', () => {
  it('accepts an optional body-fat value', () => {
    expect(parseBodyMetric({ weight: '175', bodyFat: '' })).toEqual({
      weight: 175,
      bodyFat: undefined,
      valid: true,
    });
  });
  it('rejects out-of-range body fat', () => {
    expect(parseBodyMetric({ weight: '175', bodyFat: '80' }).valid).toBe(false);
  });
});
