import { parseSetValues, validateSetValues } from './set-editor.helpers';

describe('set editor helpers', () => {
  it('parses optional numeric fields', () => {
    expect(parseSetValues({ weight: '100', reps: '8', rpe: '' })).toEqual({
      weight: 100,
      reps: 8,
      rpe: undefined,
    });
  });
  it('rejects RPE outside 1–10', () => {
    expect(validateSetValues({ rpe: 11 })).toBe(false);
  });
});
