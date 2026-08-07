import { Q } from '@nozbe/watermelondb';
import HealthSyncModule, {
  type HealthAvailability,
  type NativeHealthRecord,
} from '@fitnessgoal/health-sync-module';
import {
  database,
  HealthRecord,
  HealthSyncState,
} from '../database';
import {
  HEALTH_DATA_TYPES,
  HEALTH_SYNC_OVERLAP_MS,
  INITIAL_HEALTH_SYNC_DAYS,
} from './health-sync.constants';
import type {
  HealthProvider,
  HealthSyncResult,
  HealthSyncStatus,
  SyncHealthOptions,
} from './health-sync.types';

function isProvider(value: string): value is HealthProvider {
  return value === 'appleHealth' || value === 'healthConnect';
}

async function findState(provider: HealthProvider) {
  const states = await database
    .get<HealthSyncState>('health_sync_states')
    .query(Q.where('provider', provider), Q.take(1))
    .fetch();
  return states[0];
}

async function updateState(
  provider: HealthProvider,
  update: {
    enabled: boolean;
    lastSyncAt?: number;
    lastResultCount?: number;
    lastError?: string;
  },
) {
  const existing = await findState(provider);
  await database.write(async () => {
    if (existing) {
      await existing.update((record) => {
        record.enabled = update.enabled;
        if (update.lastSyncAt !== undefined)
          record.lastSyncAt = update.lastSyncAt;
        if (update.lastResultCount !== undefined)
          record.lastResultCount = update.lastResultCount;
        record.lastError = update.lastError;
      });
      return;
    }
    await database
      .get<HealthSyncState>('health_sync_states')
      .create((record) => {
        record.provider = provider;
        record.enabled = update.enabled;
        record.lastSyncAt = update.lastSyncAt;
        record.lastResultCount = update.lastResultCount ?? 0;
        record.lastError = update.lastError;
      });
  });
}

async function saveRecords(
  provider: HealthProvider,
  nativeRecords: NativeHealthRecord[],
) {
  if (!nativeRecords.length) return 0;
  const earliest = Math.min(
    ...nativeRecords.map((record) => Date.parse(record.startTime)),
  );
  const existing = await database
    .get<HealthRecord>('health_records')
    .query(
      Q.where('provider', provider),
      Q.where('start_time', Q.gte(earliest)),
    )
    .fetch();
  const byExternalId = new Map(existing.map((item) => [item.externalId, item]));
  const now = Date.now();

  await database.write(async () => {
    const operations = nativeRecords.map((nativeRecord) => {
      const current = byExternalId.get(nativeRecord.externalId);
      const apply = (record: HealthRecord) => {
        record.provider = provider;
        record.externalId = nativeRecord.externalId;
        record.dataType = nativeRecord.type;
        record.startTime = Date.parse(nativeRecord.startTime);
        record.endTime = Date.parse(nativeRecord.endTime);
        record.value = nativeRecord.value;
        record.unit = nativeRecord.unit;
        record.sourceName = nativeRecord.sourceName;
        record.sourceId = nativeRecord.sourceId;
        record.metadataJson = nativeRecord.metadata
          ? JSON.stringify(nativeRecord.metadata)
          : undefined;
        record.updatedAt = new Date(now);
      };
      if (current) return current.prepareUpdate(apply);
      return database
        .get<HealthRecord>('health_records')
        .prepareCreate(apply);
    });
    await database.batch(...operations);
  });
  return nativeRecords.length;
}

export async function getHealthSyncStatus(): Promise<HealthSyncStatus> {
  const availability = await HealthSyncModule.getAvailability();
  if (!isProvider(availability.provider)) {
    return { availability, connected: false, lastResultCount: 0 };
  }
  const state = await findState(availability.provider);
  return {
    availability,
    connected: state?.enabled ?? false,
    lastSyncAt: state?.lastSyncAt,
    lastResultCount: state?.lastResultCount ?? 0,
    lastError: state?.lastError,
  };
}

export async function syncHealthData(
  options: SyncHealthOptions = {},
): Promise<HealthSyncResult> {
  const availability: HealthAvailability =
    await HealthSyncModule.getAvailability();
  if (!availability.available || !isProvider(availability.provider)) {
    throw new Error(
      availability.requiresInstall
        ? 'Install or update Health Connect before connecting.'
        : 'Health data is unavailable on this device.',
    );
  }
  const provider = availability.provider;
  const state = await findState(provider);

  try {
    const permission = options.requestPermissions
      ? await HealthSyncModule.requestPermissions(HEALTH_DATA_TYPES)
      : await HealthSyncModule.getGrantedPermissions();
    if (!permission.granted) {
      throw new Error('Health data permission was not granted.');
    }

    const now = Date.now();
    const initialStart = now - INITIAL_HEALTH_SYNC_DAYS * 24 * 60 * 60 * 1000;
    const start = state?.lastSyncAt
      ? Math.max(initialStart, state.lastSyncAt - HEALTH_SYNC_OVERLAP_MS)
      : initialStart;
    const records = await HealthSyncModule.readHealthData(
      new Date(start).toISOString(),
      new Date(now).toISOString(),
      permission.grantedTypes.length
        ? permission.grantedTypes
        : HEALTH_DATA_TYPES,
    );
    const importedCount = await saveRecords(provider, records);
    await updateState(provider, {
      enabled: true,
      lastSyncAt: now,
      lastResultCount: importedCount,
    });
    return { importedCount, provider };
  } catch (error) {
    await updateState(provider, {
      enabled: state?.enabled ?? false,
      lastError: error instanceof Error ? error.message : 'Health sync failed.',
    });
    throw error;
  }
}

export async function openHealthSettings() {
  await HealthSyncModule.openSettings();
}

export async function syncConnectedHealthData() {
  const status = await getHealthSyncStatus();
  if (!status.connected || !status.availability.available) return;
  await syncHealthData();
}
