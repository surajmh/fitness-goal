import React from 'react';
import {
  formatLastHealthSync,
  getHealthAvailabilityMessage,
  getHealthProviderName,
} from '@fitnessgoal/data-access/workout';
import { FeedbackBanner } from '../FeedbackBanner';
import { PrimaryButton } from '../PrimaryButton';
import { TextButton } from '../TextButton';
import { Text, View } from '../primitives';
import type { HealthSyncCardProps } from './health-sync-card.types';

export function HealthSyncCard({
  status,
  loading,
  syncing,
  error,
  onConnect,
  onSync,
  onOpenSettings,
}: HealthSyncCardProps) {
  const providerName = getHealthProviderName(status.availability);
  const unavailableMessage = getHealthAvailabilityMessage(status.availability);

  return (
    <View className="rounded-xl bg-surface px-4 py-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-base font-bold text-ink">{providerName}</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            {status.connected
              ? `${formatLastHealthSync(status.lastSyncAt)} · ${status.lastResultCount} records in the latest sync`
              : unavailableMessage ||
                'Import workouts, activity, sleep, heart rate, and body measurements.'}
          </Text>
        </View>
        {status.connected ? (
          <View className="rounded-xl bg-success px-2.5 py-1">
            <Text className="text-xs font-bold text-on-primary">Connected</Text>
          </View>
        ) : null}
      </View>
      <View className="mt-4">
        <PrimaryButton
          disabled={loading || !status.availability.available}
          label={status.connected ? 'Sync now' : `Connect ${providerName}`}
          loading={syncing}
          onPress={status.connected ? onSync : onConnect}
          variant={status.connected ? 'secondary' : 'primary'}
        />
      </View>
      {status.connected ? (
        <TextButton label="Manage health access" onPress={onOpenSettings} />
      ) : null}
      {error || status.lastError ? (
        <View className="mt-3">
          <FeedbackBanner message={error || status.lastError || ''} tone="error" />
        </View>
      ) : null}
    </View>
  );
}
