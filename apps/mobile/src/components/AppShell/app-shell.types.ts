export type AppTab = 'today' | 'plans' | 'history' | 'progress' | 'settings';

export type AppTabItem = {
  key: AppTab;
  label: string;
};
