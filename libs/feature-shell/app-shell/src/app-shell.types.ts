export type AppTab = 'today' | 'plans' | 'history' | 'settings';

export type AppTabItem = {
  key: AppTab;
  label: string;
};
