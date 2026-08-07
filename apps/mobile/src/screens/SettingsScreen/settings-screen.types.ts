import type { Exercise, OverloadSetting } from '../../database';

export type SettingsScreenProps = {
  exercises: Exercise[];
  overloadSettings: OverloadSetting[];
};

export type OverloadInput = { triggerReps: string; increaseBy: string };
