import type { HealthSyncStatus } from '@fitnessgoal/data-access/workout';

export type HealthSyncCardProps = {
  status: HealthSyncStatus;
  loading: boolean;
  syncing: boolean;
  error?: string;
  onConnect: () => void;
  onSync: () => void;
  onOpenSettings: () => void;
};
