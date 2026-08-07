import type { Exercise, OverloadSetting } from '@fitnessgoal/data-access/workout';

export type SettingsScreenProps = {
  exercises: Exercise[];
  overloadSettings: OverloadSetting[];
};

export type OverloadInput = { triggerReps: string; increaseBy: string };
