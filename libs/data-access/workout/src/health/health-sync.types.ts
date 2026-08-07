import type {
  HealthAvailability,
  HealthDataType,
} from '@fitnessgoal/health-sync-module';

export type HealthProvider = 'appleHealth' | 'healthConnect';

export type HealthSyncStatus = {
  availability: HealthAvailability;
  connected: boolean;
  lastSyncAt?: number;
  lastResultCount: number;
  lastError?: string;
};

export type SyncHealthOptions = {
  requestPermissions?: boolean;
};

export type HealthSyncResult = {
  importedCount: number;
  provider: HealthProvider;
};

export type { HealthDataType };
