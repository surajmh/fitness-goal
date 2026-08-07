import { NativeModule, requireOptionalNativeModule } from 'expo';
import type {
  HealthAvailability,
  HealthDataType,
  HealthPermissionResult,
  NativeHealthRecord,
} from './HealthSync.types';

declare class HealthSyncModule extends NativeModule<{}> {
  getAvailability(): Promise<HealthAvailability>;
  requestPermissions(types: HealthDataType[]): Promise<HealthPermissionResult>;
  getGrantedPermissions(): Promise<HealthPermissionResult>;
  readHealthData(
    startTime: string,
    endTime: string,
    types: HealthDataType[],
  ): Promise<NativeHealthRecord[]>;
  openSettings(): Promise<void>;
}

const unavailableModule = {
  async getAvailability(): Promise<HealthAvailability> {
    return { available: false, provider: 'unavailable' };
  },
  async requestPermissions(): Promise<HealthPermissionResult> {
    return { granted: false, grantedTypes: [] };
  },
  async getGrantedPermissions(): Promise<HealthPermissionResult> {
    return { granted: false, grantedTypes: [] };
  },
  async readHealthData(): Promise<NativeHealthRecord[]> {
    return [];
  },
  async openSettings(): Promise<void> {},
};

export default (
  requireOptionalNativeModule<HealthSyncModule>('HealthSync') ??
  unavailableModule
);
