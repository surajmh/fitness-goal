import type { HealthAvailability } from '../../modules/health-sync';

export function getHealthProviderName(availability: HealthAvailability) {
  if (availability.provider === 'appleHealth') return 'Apple Health';
  if (availability.provider === 'healthConnect') return 'Health Connect';
  return 'Health data';
}

export function formatLastHealthSync(timestamp?: number) {
  if (!timestamp) return 'Not synced yet';
  return `Last synced ${new Date(timestamp).toLocaleString()}`;
}

export function getHealthAvailabilityMessage(
  availability: HealthAvailability,
) {
  if (availability.available) return '';
  if (availability.requiresInstall) {
    return 'Install or update Health Connect to sync Android health data.';
  }
  return 'Health syncing is not available on this device.';
}
