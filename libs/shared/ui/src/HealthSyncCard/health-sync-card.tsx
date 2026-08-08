import React from 'react';
import {
  formatLastHealthSync,
  getHealthAvailabilityMessage,
  getHealthProviderName,
} from '@fitnessgoal/data-access/workout';
import { FeedbackBanner } from '../FeedbackBanner';
import { TextButton } from '../TextButton';
import { Activity, Check } from '../icons';
import { Pressable, Text, useCSSVariable, View } from '../primitives';
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
  const success = useCSSVariable('--success') as string;
  const muted = useCSSVariable('--muted') as string;
  const providerName = getHealthProviderName(status.availability);
  const unavailableMessage = getHealthAvailabilityMessage(status.availability);
  const unavailable = !status.availability.available;

  return (
    <View className="rounded-2xl border border-outline bg-surface-raised p-3.5">
      <View className="flex-row items-center gap-3">
        <View
          className={`h-[38px] w-[38px] items-center justify-center rounded-xl ${
            status.connected ? 'bg-success-soft' : 'bg-surface'
          }`}
        >
          <Activity color={status.connected ? success : muted} size={20} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[15px] font-bold text-ink">{providerName}</Text>
          {status.connected ? (
            // Never colour alone: connected carries a tick and a word.
            <View className="flex-row items-center gap-1.5">
              <Check color={success} size={11} strokeWidth={3} />
              <Text className="text-xs font-semibold text-success">
                Connected
              </Text>
            </View>
          ) : (
            <Text className="text-xs font-semibold text-muted">
              {unavailable ? 'Unavailable on this device' : 'Not connected'}
            </Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: loading || unavailable,
            busy: syncing,
          }}
          className={`min-h-8 justify-center rounded-full px-3.5 ${
            loading || unavailable ? 'bg-outline' : 'bg-primary'
          }`}
          disabled={loading || syncing || unavailable}
          onPress={status.connected ? onSync : onConnect}
        >
          <Text
            className={`text-xs font-bold ${
              loading || unavailable
                ? 'text-placeholder-ink'
                : 'text-on-primary'
            }`}
          >
            {syncing ? 'Syncing' : status.connected ? 'Sync' : 'Connect'}
          </Text>
        </Pressable>
      </View>

      <View className="mt-2.5 border-t border-outline pt-2.5">
        <Text className="text-xs font-semibold tabular-nums text-muted">
          {status.connected
            ? `${formatLastHealthSync(status.lastSyncAt)} · ${status.lastResultCount} records`
            : unavailableMessage ||
              'Workouts, activity, sleep, heart rate and body measurements.'}
        </Text>
      </View>

      {status.connected ? (
        <TextButton label="Manage health access" onPress={onOpenSettings} />
      ) : null}
      {error || status.lastError ? (
        <View className="mt-2">
          <FeedbackBanner
            message={error || status.lastError || ''}
            tone="error"
          />
        </View>
      ) : null}
    </View>
  );
}
