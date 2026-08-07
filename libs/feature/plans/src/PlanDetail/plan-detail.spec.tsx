import React from 'react';
import { PlanDetail } from './plan-detail';

jest.mock('react-native', () => ({
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Platform: { OS: 'ios' },
}));
jest.mock('@fitnessgoal/shared/ui', () => ({
  Copy: 'Copy',
  ExerciseArtwork: 'ExerciseArtwork',
  FeedbackBanner: 'FeedbackBanner',
  Page: 'Page',
  Pencil: 'Pencil',
  Play: 'Play',
  PrimaryButton: 'PrimaryButton',
  Row: 'Row',
  ScreenTitle: 'ScreenTitle',
  Text: 'Text',
  TextButton: 'TextButton',
  TextInput: 'TextInput',
  useCSSVariable: () => '#000',
  View: 'View',
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
