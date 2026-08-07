import { useCallback, useEffect, useState } from 'react';
import {
  getHealthSyncStatus,
  openHealthSettings,
  syncHealthData,
} from './health-sync.service';
import type { HealthSyncStatus } from './health-sync.types';

const EMPTY_STATUS: HealthSyncStatus = {
  availability: { available: false, provider: 'unavailable' },
  connected: false,
  lastResultCount: 0,
};

export function useHealthSync() {
  const [status, setStatus] = useState(EMPTY_STATUS);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setStatus(await getHealthSyncStatus());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to check health sync.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runSync = useCallback(
    async (requestPermissions: boolean) => {
      setSyncing(true);
      setError('');
      try {
        await syncHealthData({ requestPermissions });
        await refresh();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Health sync failed.');
      } finally {
        setSyncing(false);
      }
    },
    [refresh],
  );

  return {
    status,
    loading,
    syncing,
    error,
    connect: () => runSync(true),
    syncNow: () => runSync(false),
    openSettings: openHealthSettings,
  };
}
