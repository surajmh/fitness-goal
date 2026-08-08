import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActiveWorkoutScreen } from '@fitnessgoal/feature/active-workout';
import { HistoryScreen } from '@fitnessgoal/feature/history';
import { PlansScreen } from '@fitnessgoal/feature/plans';
import { SettingsScreen } from '@fitnessgoal/feature/settings';
import { TodayScreen } from '@fitnessgoal/feature/today';
import {
  ClipboardList,
  Pressable,
  PrimaryButton,
  Text,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import { APP_TABS, TAB_ICONS } from './app-shell.constants';
import { useAppShell } from './use-app-shell';

function LoadingScreen({
  error,
  onRetry,
}: {
  error?: Error | null;
  onRetry: () => void;
}) {
  const onPrimary = useCSSVariable('--on-primary') as string;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center bg-canvas px-8">
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-primary">
          <ClipboardList color={onPrimary} size={28} />
        </View>
        <Text className="mt-5 text-xl font-bold text-ink">
          {error ? 'Unable to open your log' : 'Preparing your local log'}
        </Text>
        <Text className="mt-2 text-center text-base leading-6 text-muted">
          {error
            ? 'Your on-device data is still safe. Try opening the log again.'
            : 'Your exercise catalog is being saved on this device.'}
        </Text>
        {error ? (
          <View className="mt-5 min-w-40">
            <PrimaryButton label="Try again" onPress={onRetry} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export function AppShell() {
  const primary = useCSSVariable('--primary') as string;
  const muted = useCSSVariable('--muted') as string;
  const canvas = useCSSVariable('--canvas') as string;
  const {
    tab,
    setTab,
    activeSessionId,
    expanded,
    scheme,
    hydrated,
    isReady,
    error,
    retry,
  } = useAppShell();

  if (!isReady || error || !hydrated)
    return <LoadingScreen error={error} onRetry={retry} />;

  const content = activeSessionId ? (
    <ActiveWorkoutScreen sessionId={activeSessionId} />
  ) : (
    {
      today: <TodayScreen />,
      plans: <PlansScreen />,
      history: <HistoryScreen />,
      settings: <SettingsScreen />,
    }[tab]
  );

  const navigation = (
    <View
      className={
        expanded
          ? 'w-24 border-r border-outline bg-canvas px-2 py-3'
          : `h-16 flex-row items-center border-t border-outline bg-canvas px-1 ${Platform.OS === 'android' ? 'pb-1' : ''}`
      }
    >
      {APP_TABS.map((item) => {
        const selected = tab === item.key;
        const glyphs = TAB_ICONS[item.key];
        const Icon = selected ? glyphs.current : glyphs.idle;
        return (
          <Pressable
            key={item.key}
            accessibilityLabel={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={
              expanded
                ? `mb-2 min-h-16 items-center justify-center gap-1 rounded-xl ${selected ? 'bg-primary-soft' : ''}`
                : 'min-h-14 flex-1 items-center justify-center gap-1'
            }
            onPress={() => setTab(item.key)}
          >
            <Icon color={selected ? primary : muted} size={24} />
            <Text
              className={`text-xs font-semibold ${selected ? 'text-primary' : 'text-muted'}`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-canvas">
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View className={`flex-1 ${expanded ? 'flex-row' : ''}`}>
          {!activeSessionId && expanded ? navigation : null}
          <View className="flex-1">{content}</View>
        </View>
        {!activeSessionId && !expanded ? (
          <SafeAreaView style={{ backgroundColor: canvas }} edges={['bottom']}>
            {navigation}
          </SafeAreaView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
