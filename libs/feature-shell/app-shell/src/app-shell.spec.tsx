import type React from 'react';
import { APP_TABS } from './app-shell.constants';
import { AppShell } from './app-shell';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('expo-status-bar', () => ({ StatusBar: 'StatusBar' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));
jest.mock('@fitnessgoal/feature/active-workout', () => ({
  ActiveWorkoutScreen: 'ActiveWorkoutScreen',
}));
jest.mock('@fitnessgoal/feature/history', () => ({
  HistoryScreen: 'HistoryScreen',
}));
jest.mock('@fitnessgoal/feature/plans', () => ({ PlansScreen: 'PlansScreen' }));
jest.mock('@fitnessgoal/feature/settings', () => ({
  SettingsScreen: 'SettingsScreen',
}));
jest.mock('@fitnessgoal/feature/today', () => ({ TodayScreen: 'TodayScreen' }));
jest.mock('@fitnessgoal/shared/ui', () => ({
  ClipboardList: 'ClipboardList',
  HistoryFilled: 'HistoryFilled',
  HistoryIcon: 'HistoryIcon',
  HomeFilled: 'HomeFilled',
  HomeIcon: 'HomeIcon',
  PlanFilled: 'PlanFilled',
  PlanIcon: 'PlanIcon',
  Pressable: 'Pressable',
  PrimaryButton: 'PrimaryButton',
  SettingsFilled: 'SettingsFilled',
  SettingsIcon: 'SettingsIcon',
  Text: 'Text',
  useCSSVariable: () => '#000',
  View: 'View',
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
