import {
  HistoryIcon,
  HomeIcon,
  PlanIcon,
  ProgressIcon,
  SettingsIcon,
} from '../../ui/icons';
import type { AppTab, AppTabItem } from './app-shell.types';

export const APP_TABS: AppTabItem[] = [
  { key: 'today', label: 'Today' },
  { key: 'plans', label: 'Plans' },
  { key: 'history', label: 'History' },
  { key: 'progress', label: 'Progress' },
  { key: 'settings', label: 'Settings' },
];

export const TAB_ICONS = {
  today: HomeIcon,
  plans: PlanIcon,
  history: HistoryIcon,
  progress: ProgressIcon,
  settings: SettingsIcon,
} satisfies Record<AppTab, typeof HomeIcon>;
