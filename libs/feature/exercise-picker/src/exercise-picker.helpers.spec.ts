import { filterExercises, formatFilterLabel } from './exercise-picker.helpers';

describe('filterExercises', () => {
  it('filters by query, muscle, and equipment', () => {
    const exercises = [
      { name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell' },
    ] as never;
    expect(
      filterExercises(exercises, {
        query: 'bench',
        muscle: 'chest',
        equipment: 'barbell',
      }),
    ).toHaveLength(1);
    expect(
      filterExercises(exercises, {
        query: 'row',
        muscle: 'all',
        equipment: 'all',
      }),
    ).toHaveLength(0);
  });
});

describe('formatFilterLabel', () => {
  it('capitalizes words and handles all', () => {
    expect(formatFilterLabel('all')).toBe('All');
    expect(formatFilterLabel('upper legs')).toBe('Upper Legs');
    expect(formatFilterLabel('leverage machine')).toBe('Leverage Machine');
  });
});
