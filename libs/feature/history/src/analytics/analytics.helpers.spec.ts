import { parseBodyMetric } from './analytics.helpers';

describe('parseBodyMetric', () => {
  it('validates weight and body fat range', () => {
    expect(parseBodyMetric({ weight: '180', bodyFat: '15' })).toEqual({
      weight: 180,
      bodyFat: 15,
      valid: true,
    });
    expect(parseBodyMetric({ weight: '0' }).valid).toBe(false);
  });
});
