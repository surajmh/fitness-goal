import type React from 'react';
import { APP_TABS } from './app-shell.constants';
import { AppShell } from './app-shell';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('expo-status-bar', () => ({ StatusBar: 'StatusBar' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));
jest.mock('../../screens/screens', () => ({
  ActiveWorkoutScreen: 'ActiveWorkoutScreen',
  HistoryScreen: 'HistoryScreen',
  PlansScreen: 'PlansScreen',
  ProgressScreen: 'ProgressScreen',
  SettingsScreen: 'SettingsScreen',
  TodayScreen: 'TodayScreen',
}));
jest.mock('../../ui/PrimaryButton', () => ({ PrimaryButton: 'PrimaryButton' }));
jest.mock('../../ui/primitives', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  View: 'View',
  useCSSVariable: () => '#000',
}));

jest.mock('../../ui/icons', () => ({
  HomeIcon: 'HomeIcon',
  PlanIcon: 'PlanIcon',
  HistoryIcon: 'HistoryIcon',
  ProgressIcon: 'ProgressIcon',
  SettingsIcon: 'SettingsIcon',
  ClipboardList: 'ClipboardList',
}));
jest.mock('./use-app-shell', () => ({
  useAppShell: () => ({
    tab: 'today',
    setTab: jest.fn(),
    activeSessionId: null,
    expanded: false,
    scheme: 'light',
    hydrated: true,
    isReady: true,
    error: null,
    retry: jest.fn(),
  }),
}));

describe('AppShell configuration', () => {
  it('keeps tab keys unique', () => {
    expect(new Set(APP_TABS.map((tab) => tab.key)).size).toBe(APP_TABS.length);
  });

  it('fills the safe area so screen content receives available height', () => {
    const element = AppShell() as React.ReactElement<{
      style: { flex: number };
    }>;
    expect(element.props.style).toEqual({ flex: 1 });
  });
});
