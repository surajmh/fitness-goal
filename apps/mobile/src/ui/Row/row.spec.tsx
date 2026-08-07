import type React from 'react';
import { Row } from './row';

jest.mock('../icons', () => ({ ChevronRight: 'ChevronRight' }));
jest.mock('../primitives', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  View: 'View',
  useCSSVariable: () => '#999',
}));

describe('Row', () => {
  it('becomes a button when an onPress handler is provided', () => {
    const onPress = jest.fn();
    const element = Row({ title: 'Workout', onPress }) as React.ReactElement<{
      accessibilityRole: string;
      onPress: () => void;
    }>;
    expect(element.props.accessibilityRole).toBe('button');
    element.props.onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
