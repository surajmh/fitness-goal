import React from 'react';
import { SearchField } from './search-field';

jest.mock('../icons', () => ({ Search: 'Search', X: 'X' }));
jest.mock('../primitives', () => ({
  Pressable: 'Pressable',
  TextInput: 'TextInput',
  View: 'View',
  useCSSVariable: () => '#999',
}));

describe('SearchField', () => {
  it('clears a populated search value', () => {
    const onChangeText = jest.fn();
    const element = SearchField({
      value: 'bench',
      onChangeText,
    }) as React.ReactElement<{ children: React.ReactNode }>;
    const children = React.Children.toArray(
      element.props.children,
    ) as React.ReactElement<{ onPress?: () => void }>[];

    children.find((child) => child.props.onPress)?.props.onPress?.();
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});
