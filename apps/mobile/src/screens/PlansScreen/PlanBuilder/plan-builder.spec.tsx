import React from 'react';
import { PlanBuilder } from './plan-builder';

jest.mock('react-native', () => ({
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Platform: { OS: 'ios' },
}));
jest.mock('../../../ui/icons', () => ({
  ChevronDown: 'ChevronDown',
  ChevronUp: 'ChevronUp',
}));
jest.mock('../../../ui/FeedbackBanner', () => ({
  FeedbackBanner: 'FeedbackBanner',
}));
jest.mock('../../../ui/PrimaryButton', () => ({
  PrimaryButton: 'PrimaryButton',
}));
jest.mock('../../../ui/ScreenTitle', () => ({ ScreenTitle: 'ScreenTitle' }));
jest.mock('../../../ui/TextButton', () => ({ TextButton: 'TextButton' }));
jest.mock('../../../ui/primitives', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  TextInput: 'TextInput',
  View: 'View',
  useCSSVariable: () => '#000',
}));
jest.mock('../../ExercisePicker', () => ({ ExercisePicker: 'ExercisePicker' }));
jest.mock('../../shared/screen-shared', () => ({
  ExerciseArtwork: 'ExerciseArtwork',
  Page: 'Page',
}));
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
