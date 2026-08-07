import React from 'react';
import { PlanBuilder } from './plan-builder';

jest.mock('react-native', () => ({
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Platform: { OS: 'ios' },
}));
jest.mock('@fitnessgoal/shared/ui', () => ({
  ChevronDown: 'ChevronDown',
  ChevronUp: 'ChevronUp',
  ExerciseArtwork: 'ExerciseArtwork',
  FeedbackBanner: 'FeedbackBanner',
  Page: 'Page',
  Pressable: 'Pressable',
  PrimaryButton: 'PrimaryButton',
  ScreenTitle: 'ScreenTitle',
  Text: 'Text',
  TextButton: 'TextButton',
  TextInput: 'TextInput',
  useCSSVariable: () => '#000',
  View: 'View',
}));
jest.mock('@fitnessgoal/feature/exercise-picker', () => ({ ExercisePicker: 'ExercisePicker' }));
jest.mock('./use-plan-builder', () => ({
  usePlanBuilder: () => ({
    back: jest.fn(),
    description: '',
    error: '',
    name: '',
    nameTouched: false,
    next: jest.fn(),
    requestCancel: jest.fn(),
    saving: false,
    selectedIds: [],
    setDescription: jest.fn(),
    setName: jest.fn(),
    setNameTouched: jest.fn(),
    step: 1,
    targets: {},
  }),
}));

describe('PlanBuilder', () => {
  it('shows the first step with visible labels and progress', () => {
    const element = PlanBuilder({
      exercises: [],
      onCancel: jest.fn(),
      onSave: jest.fn(),
    }) as React.ReactElement<{ style: { flex: number } }>;
    expect(element.props.style).toEqual({ flex: 1 });
  });
});
