import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { database, User } from '../database';

type AppState = {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  weightUnit: 'lb' | 'kg';
  setWeightUnit: (unit: 'lb' | 'kg') => Promise<void>;
  restTimerSeconds: number;
  setRestTimerSeconds: (seconds: number) => Promise<void>;
  hydratePreferences: () => Promise<void>;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [weightUnit, setWeightUnitState] = useState<'lb' | 'kg'>('lb');
  const [restTimerSeconds, setRestTimerSecondsState] = useState(90);

  const updateUser = useCallback(
    async (input: { weightUnit?: 'lb' | 'kg'; restTimerSeconds?: number }) => {
      const user = await database.get<User>('users').find('local-user');
      await database.write(() =>
        user.update((record) => {
          if (input.weightUnit) record.preferredWeightUnit = input.weightUnit;
          if (input.restTimerSeconds)
            record.restTimerDefault = input.restTimerSeconds;
        }),
      );
    },
    [],
  );

  const setWeightUnit = useCallback(
    async (unit: 'lb' | 'kg') => {
      setWeightUnitState(unit);
      await updateUser({ weightUnit: unit });
    },
    [updateUser],
  );

  const setRestTimerSeconds = useCallback(
    async (seconds: number) => {
      setRestTimerSecondsState(seconds);
      await updateUser({ restTimerSeconds: seconds });
    },
    [updateUser],
  );

  const hydratePreferences = useCallback(async () => {
    const user = await database.get<User>('users').find('local-user');
    setWeightUnitState(user.preferredWeightUnit === 'kg' ? 'kg' : 'lb');
    setRestTimerSecondsState(user.restTimerDefault || 90);
  }, []);
  const value = useMemo(
    () => ({
      activeSessionId,
      setActiveSessionId,
      weightUnit,
      setWeightUnit,
      restTimerSeconds,
      setRestTimerSeconds,
      hydratePreferences,
    }),
    [
      activeSessionId,
      hydratePreferences,
      restTimerSeconds,
      setRestTimerSeconds,
      setWeightUnit,
      weightUnit,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppState must be used inside AppProvider');
  return value;
}
