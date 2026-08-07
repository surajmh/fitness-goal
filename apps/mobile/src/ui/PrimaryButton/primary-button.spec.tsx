import type React from 'react';
import { PrimaryButton } from './primary-button';

jest.mock('react-native', () => ({ ActivityIndicator: 'ActivityIndicator' }));
jest.mock('../primitives', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  useCSSVariable: () => '#fff',
}));

describe('PrimaryButton', () => {
  it('exposes disabled and busy states', () => {
    const element = PrimaryButton({
      label: 'Save',
      onPress: jest.fn(),
      disabled: true,
      loading: true,
    }) as React.ReactElement<{
      accessibilityRole: string;
      accessibilityState: { disabled?: boolean; busy?: boolean };
      disabled: boolean;
    }>;

    expect(element.props.accessibilityRole).toBe('button');
    expect(element.props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });
    expect(element.props.disabled).toBe(true);
  });
});
