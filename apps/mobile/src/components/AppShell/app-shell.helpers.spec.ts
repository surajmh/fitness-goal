import { isExpandedLayout } from './app-shell.helpers';

describe('isExpandedLayout', () => {
  it('switches at the tablet breakpoint', () => {
    expect(isExpandedLayout(839)).toBe(false);
    expect(isExpandedLayout(840)).toBe(true);
  });
});
