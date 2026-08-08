import type React from 'react';
import { FeedbackBanner } from './feedback-banner';
import type { FeedbackTone } from './feedback-banner.types';

jest.mock('../icons', () => ({
  AlertTriangle: 'AlertTriangle',
  Check: 'Check',
  Info: 'Info',
}));
jest.mock('../primitives', () => ({
  Text: 'Text',
  View: 'View',
  useCSSVariable: () => '#fff',
}));

describe('FeedbackBanner', () => {
  it('announces feedback changes politely', () => {
    const element = FeedbackBanner({
      message: 'Saved',
      tone: 'success',
    }) as React.ReactElement<{
      accessibilityLiveRegion: string;
      className: string;
    }>;
    expect(element.props.accessibilityLiveRegion).toBe('polite');
    expect(element.props.className).toContain('bg-success-soft');
  });

  it('tints each tone with its own soft surface', () => {
    const classNameFor = (tone: FeedbackTone) =>
      (
        FeedbackBanner({ message: 'x', tone }) as React.ReactElement<{
          className: string;
        }>
      ).props.className;

    expect(classNameFor('error')).toContain('bg-danger-soft');
    expect(classNameFor('info')).toContain('bg-surface');
  });
});
