import type { HealthDataType } from './health-sync.types';

export const HEALTH_DATA_TYPES: HealthDataType[] = [
  'steps',
  'exercise',
  'activeCalories',
  'distance',
  'heartRate',
  'sleep',
  'weight',
  'bodyFat',
];

export const INITIAL_HEALTH_SYNC_DAYS = 29;
export const HEALTH_SYNC_OVERLAP_MS = 24 * 60 * 60 * 1000;
