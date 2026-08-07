import type React from 'react';
import { FeedbackBanner } from './feedback-banner';

jest.mock('../primitives', () => ({ Text: 'Text', View: 'View' }));

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
    expect(element.props.className).toContain('border-success');
  });
});
