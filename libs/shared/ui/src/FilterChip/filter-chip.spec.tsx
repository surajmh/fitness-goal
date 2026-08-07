import type React from 'react';
import { FilterChip } from './filter-chip';

jest.mock('../icons', () => ({ Check: 'Check' }));
jest.mock('../primitives', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  useCSSVariable: () => '#fff',
}));

describe('FilterChip', () => {
  it('reports its selected state', () => {
    const element = FilterChip({
      label: 'Chest',
      selected: true,
      onPress: jest.fn(),
    }) as React.ReactElement<{
      accessibilityRole: string;
      accessibilityState: { selected: boolean };
    }>;
    expect(element.props.accessibilityRole).toBe('button');
    expect(element.props.accessibilityState.selected).toBe(true);
  });
});
