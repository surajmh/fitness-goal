import {
  HistoryFilled,
  HistoryIcon,
  HomeFilled,
  HomeIcon,
  PlanFilled,
  PlanIcon,
  SettingsFilled,
  SettingsIcon,
} from '@fitnessgoal/shared/ui';
import type { AppTab, AppTabItem } from './app-shell.types';

export const APP_TABS: AppTabItem[] = [
  { key: 'today', label: 'Today' },
  { key: 'plans', label: 'Plans' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
];

/** Outline for a destination you can go to, solid for the one you are on. */
export const TAB_ICONS = {
  today: { idle: HomeIcon, current: HomeFilled },
  plans: { idle: PlanIcon, current: PlanFilled },
  history: { idle: HistoryIcon, current: HistoryFilled },
  settings: { idle: SettingsIcon, current: SettingsFilled },
} satisfies Record<AppTab, { idle: typeof HomeIcon; current: typeof HomeIcon }>;
