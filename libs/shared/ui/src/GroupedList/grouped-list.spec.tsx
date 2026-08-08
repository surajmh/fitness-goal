import React from 'react';
import { GroupedList } from './grouped-list';

jest.mock('../primitives', () => ({ View: 'View' }));

const rowsOf = (element: React.ReactElement) =>
  React.Children.toArray(
    (element.props as { children: React.ReactNode }).children,
  );

describe('GroupedList', () => {
  it('puts a divider between rows but not around them', () => {
    const element = GroupedList({
      children: [
        React.createElement('Row', { key: 'a' }),
        React.createElement('Row', { key: 'b' }),
        React.createElement('Row', { key: 'c' }),
      ],
    }) as React.ReactElement;

    // Three fragments; only the second and third carry a leading divider.
    const fragments = rowsOf(element);
    expect(fragments).toHaveLength(3);
    expect(rowsOf(fragments[0] as React.ReactElement)).toHaveLength(1);
    expect(rowsOf(fragments[1] as React.ReactElement)).toHaveLength(2);
  });

  it('does not leave a stray divider where a row is conditionally absent', () => {
    const element = GroupedList({
      children: [React.createElement('Row', { key: 'a' }), null, false],
    }) as React.ReactElement;

    const fragments = rowsOf(element);
    expect(fragments).toHaveLength(1);
    expect(rowsOf(fragments[0] as React.ReactElement)).toHaveLength(1);
  });
});
