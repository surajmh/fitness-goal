import { filterExercises } from './exercise-picker.helpers';

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
