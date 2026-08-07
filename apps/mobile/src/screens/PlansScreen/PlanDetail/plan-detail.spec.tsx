import React from 'react';
import { PlanDetail } from './plan-detail';

jest.mock('react-native', () => ({
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Platform: { OS: 'ios' },
}));
jest.mock('../../../ui/icons', () => ({
  Copy: 'Copy',
  Pencil: 'Pencil',
  Play: 'Play',
}));
jest.mock('../../../ui/FeedbackBanner', () => ({
  FeedbackBanner: 'FeedbackBanner',
}));
jest.mock('../../../ui/PrimaryButton', () => ({
  PrimaryButton: 'PrimaryButton',
}));
jest.mock('../../../ui/Row', () => ({ Row: 'Row' }));
jest.mock('../../../ui/ScreenTitle', () => ({ ScreenTitle: 'ScreenTitle' }));
jest.mock('../../../ui/TextButton', () => ({ TextButton: 'TextButton' }));
jest.mock('../../../ui/primitives', () => ({
  Text: 'Text',
  TextInput: 'TextInput',
  View: 'View',
  useCSSVariable: () => '#000',
}));
jest.mock('../../shared/screen-shared', () => ({
  ExerciseArtwork: 'ExerciseArtwork',
  Page: 'Page',
}));
jest.mock('./use-plan-detail', () => ({
  usePlanDetail: () => ({
    action: null,
    beginEditing: jest.fn(),
    confirmDelete: jest.fn(),
    duplicate: jest.fn(),
    editing: false,
    error: '',
    start: jest.fn(),
  }),
}));

describe('PlanDetail', () => {
  it('presents plan summary and actions', () => {
    const element = PlanDetail({
      entries: [],
      exercises: [],
      onBack: jest.fn(),
      onDelete: jest.fn(),
      onDuplicate: jest.fn(),
      onStart: jest.fn(),
      onUpdate: jest.fn(),
      plan: { name: 'Upper', description: '' } as never,
    }) as React.ReactElement<{ children: React.ReactNode }>;
    expect(React.Children.count(element.props.children)).toBeGreaterThan(5);
  });
});
