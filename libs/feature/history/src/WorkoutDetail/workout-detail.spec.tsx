import React from 'react';
import { WorkoutDetail } from './workout-detail';

const repeat = jest.fn();
const confirmDelete = jest.fn();

jest.mock('@fitnessgoal/shared/ui', () => ({
  Copy: 'Copy',
  ExerciseArtwork: 'ExerciseArtwork',
  FeedbackBanner: 'FeedbackBanner',
  Page: 'Page',
  PrimaryButton: 'PrimaryButton',
  ScreenTitle: 'ScreenTitle',
  Text: 'Text',
  TextButton: 'TextButton',
  useCSSVariable: () => '#fff',
  View: 'View',
}));
jest.mock('./use-workout-detail', () => ({
  useWorkoutDetail: () => ({
    confirmDelete,
    error: '',
    repeat,
    repeating: false,
  }),
}));

describe('WorkoutDetail', () => {
  it('presents the workout summary and actions', () => {
    const element = WorkoutDetail({
      exercises: [],
      onBack: jest.fn(),
      onDelete: jest.fn(),
      onRepeat: jest.fn(),
      session: {
        startTime: new Date('2026-07-31T12:00:00Z').getTime(),
        endTime: new Date('2026-07-31T12:30:00Z').getTime(),
        notes: '',
      } as never,
      summary: { grouped: {}, sessionSets: [], volume: 0 },
      weightUnit: 'lb',
    }) as React.ReactElement<{ children: React.ReactNode }>;

    expect(React.Children.count(element.props.children)).toBeGreaterThan(4);
  });
});
