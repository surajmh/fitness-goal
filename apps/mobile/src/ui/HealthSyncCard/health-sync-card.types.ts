import type { HealthSyncStatus } from '../../health';

export type HealthSyncCardProps = {
  status: HealthSyncStatus;
  loading: boolean;
  syncing: boolean;
  error?: string;
  onConnect: () => void;
  onSync: () => void;
  onOpenSettings: () => void;
};
