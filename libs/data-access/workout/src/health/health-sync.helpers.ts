import type { HealthAvailability } from '@fitnessgoal/health-sync-module';

export function getHealthProviderName(availability: HealthAvailability) {
  if (availability.provider === 'appleHealth') return 'Apple Health';
  if (availability.provider === 'healthConnect') return 'Health Connect';
  return 'Health data';
}

/**
 * "Last synced 08:12" for a sync from today, "Last synced 6 Aug" before that —
 * a wall-clock time is only meaningful while the day is still the same one.
 */
export function formatLastHealthSync(timestamp?: number, now = new Date()) {
  if (!timestamp) return 'Not synced yet';
  const date = new Date(timestamp);
  const when =
    date.toDateString() === now.toDateString()
      ? date.toLocaleTimeString('en-AU', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  return `Last synced ${when}`;
}

export function getHealthAvailabilityMessage(availability: HealthAvailability) {
  if (availability.available) return '';
  if (availability.requiresInstall) {
    return 'Install or update Health Connect to sync Android health data.';
  }
  return 'Health syncing is not available on this device.';
}
