import {
  HistoryIcon,
  HomeIcon,
  PlanIcon,
  SettingsIcon,
} from '@fitnessgoal/shared/ui';
import type { AppTab, AppTabItem } from './app-shell.types';

export const APP_TABS: AppTabItem[] = [
  { key: 'today', label: 'Today' },
  { key: 'plans', label: 'Plans' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
];

export const TAB_ICONS = {
  today: HomeIcon,
  plans: PlanIcon,
  history: HistoryIcon,
  settings: SettingsIcon,
} satisfies Record<AppTab, typeof HomeIcon>;
