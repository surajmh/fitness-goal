import { parseOverloadInput } from './settings-screen.helpers';

describe('parseOverloadInput', () => {
  it('accepts a valid overload rule', () => {
    expect(
      parseOverloadInput({ triggerReps: '12', increaseBy: '5' }).valid,
    ).toBe(true);
  });
  it('rejects fractional trigger reps', () => {
    expect(
      parseOverloadInput({ triggerReps: '1.5', increaseBy: '5' }).valid,
    ).toBe(false);
  });
});
