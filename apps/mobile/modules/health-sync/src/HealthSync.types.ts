export type HealthDataType =
  | 'steps'
  | 'exercise'
  | 'activeCalories'
  | 'distance'
  | 'heartRate'
  | 'sleep'
  | 'weight'
  | 'bodyFat';

export type HealthAvailability = {
  available: boolean;
  provider: 'appleHealth' | 'healthConnect' | 'unavailable';
  requiresInstall?: boolean;
};

export type HealthPermissionResult = {
  granted: boolean;
  grantedTypes: HealthDataType[];
};

export type NativeHealthRecord = {
  externalId: string;
  type: HealthDataType;
  startTime: string;
  endTime: string;
  value?: number;
  unit?: string;
  sourceName: string;
  sourceId: string;
  metadata?: Record<string, string | number | boolean | null>;
};
