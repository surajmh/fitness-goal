import React from 'react';
import { EmptyState } from './empty-state';

jest.mock('../primitives', () => ({ Text: 'Text', View: 'View' }));

describe('EmptyState', () => {
  it('renders its title, message, and optional action', () => {
    const action = React.createElement('Action');
    const element = EmptyState({
      title: 'No plans',
      message: 'Create one.',
      action,
    }) as React.ReactElement<{ children: React.ReactNode }>;
    expect(React.Children.count(element.props.children)).toBe(3);
  });
});
