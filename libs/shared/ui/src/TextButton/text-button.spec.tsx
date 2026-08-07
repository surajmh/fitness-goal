import type React from 'react';
import { TextButton } from './text-button';

jest.mock('../primitives', () => ({ Pressable: 'Pressable', Text: 'Text' }));

describe('TextButton', () => {
  it('exposes button semantics and its handler', () => {
    const onPress = jest.fn();
    const element = TextButton({
      label: 'Delete',
      onPress,
      destructive: true,
    }) as React.ReactElement<{
      accessibilityRole: string;
      onPress: () => void;
    }>;

    expect(element.props.accessibilityRole).toBe('button');
    element.props.onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
