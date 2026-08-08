import seed from './seed.json';
import seedPlans from './seed-plans.json';

const catalog = new Set(seed.map((exercise) => exercise.dataset_id));

describe('seed plans', () => {
  it('only reference exercises that exist in the catalog', () => {
    const missing = seedPlans.flatMap((plan) =>
      plan.exercises
        .filter((entry) => !catalog.has(entry.dataset_id))
        .map((entry) => `${plan.name} -> ${entry.dataset_id}`),
    );
    expect(missing).toEqual([]);
  });

  it('are grouped under the three difficulty levels', () => {
    const levels = new Set(seedPlans.map((plan) => plan.name.split(' · ')[0]));
    expect([...levels].sort()).toEqual([
      'Advanced',
      'Beginner',
      'Intermediate',
    ]);
  });

  it('use sane set and rep targets', () => {
    for (const plan of seedPlans) {
      expect(plan.exercises.length).toBeGreaterThan(0);
      for (const entry of plan.exercises) {
        expect(entry.sets).toBeGreaterThanOrEqual(1);
        expect(entry.sets).toBeLessThanOrEqual(6);
        expect(entry.reps).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
