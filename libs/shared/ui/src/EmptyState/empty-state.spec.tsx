import React from 'react';
import { EmptyState } from './empty-state';

jest.mock('../icons', () => ({ Dumbbell: 'Dumbbell' }));
jest.mock('../primitives', () => ({
  Text: 'Text',
  View: 'View',
  useCSSVariable: () => '#fff',
}));

describe('EmptyState', () => {
  it('renders its icon tile, title, message, and optional action', () => {
    const action = React.createElement('Action');
    const element = EmptyState({
      title: 'No plans',
      message: 'Create one.',
      action,
    }) as React.ReactElement<{ children: React.ReactNode }>;
    expect(React.Children.toArray(element.props.children)).toHaveLength(4);
  });
});
