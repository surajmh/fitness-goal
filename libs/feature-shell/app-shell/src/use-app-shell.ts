import { useEffect, useState } from 'react';
import { BackHandler, useColorScheme, useWindowDimensions } from 'react-native';
import {
  findActiveSession,
  useAppState,
  useHealthAutoSync,
  useInitialSeed,
} from '@fitnessgoal/data-access/workout';
import { isExpandedLayout } from './app-shell.helpers';
import type { AppTab } from './app-shell.types';

export function useAppShell() {
  const [tab, setTab] = useState<AppTab>('today');
  const [hydrated, setHydrated] = useState(false);
  const { activeSessionId, setActiveSessionId, hydratePreferences } =
    useAppState();
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const seed = useInitialSeed();
  useHealthAutoSync(seed.isReady && hydrated);

  useEffect(() => {
    if (!seed.isReady) return;
    Promise.all([hydratePreferences(), findActiveSession()])
      .then(([, session]) => {
        setActiveSessionId(session?.id ?? null);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, [hydratePreferences, seed.isReady, setActiveSessionId]);

  useEffect(() => {
    if (!activeSessionId) return;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setActiveSessionId(null);
        return true;
      },
    );
    return () => subscription.remove();
  }, [activeSessionId, setActiveSessionId]);

  return {
    tab,
    setTab,
    activeSessionId,
    expanded: isExpandedLayout(width),
    scheme,
    hydrated,
    ...seed,
  };
}
