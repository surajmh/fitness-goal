import { registerWebModule, NativeModule } from 'expo';
import type {
  HealthAvailability,
  HealthDataType,
  HealthPermissionResult,
  NativeHealthRecord,
} from './HealthSync.types';

// HealthSyncModule is not available on the web platform.
class HealthSyncModule extends NativeModule<{}> {
  async getAvailability(): Promise<HealthAvailability> {
    return { available: false, provider: 'unavailable' };
  }

  async requestPermissions(
    _types: HealthDataType[],
  ): Promise<HealthPermissionResult> {
    return { granted: false, grantedTypes: [] };
  }

  async getGrantedPermissions(): Promise<HealthPermissionResult> {
    return { granted: false, grantedTypes: [] };
  }

  async readHealthData(
    _startTime: string,
    _endTime: string,
    _types: HealthDataType[],
  ): Promise<NativeHealthRecord[]> {
    return [];
  }

  async openSettings(): Promise<void> {}
}

export default registerWebModule(HealthSyncModule, 'HealthSyncModule');
