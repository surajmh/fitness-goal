import React from 'react';
import { ScreenTitle } from './screen-title';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('../primitives', () => ({ Text: 'Text', View: 'View' }));

describe('ScreenTitle', () => {
  it('marks the title as a header', () => {
    const element = ScreenTitle({ title: 'Progress' }) as React.ReactElement<{
      children: React.ReactNode;
    }>;
    const title = React.Children.toArray(
      element.props.children,
    )[0] as React.ReactElement<{ accessibilityRole: string }>;
    expect(title.props.accessibilityRole).toBe('header');
  });
});
