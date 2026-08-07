import { useEffect } from 'react';
import { AppState } from 'react-native';
import { syncConnectedHealthData } from './health-sync.service';

export function useHealthAutoSync(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    void syncConnectedHealthData().catch(() => undefined);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncConnectedHealthData().catch(() => undefined);
      }
    });
    return () => subscription.remove();
  }, [enabled]);
}
