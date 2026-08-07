/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  BrandMark,
  Copy,
  Dumbbell,
  Play,
  ProgressIcon,
  RotateCcw,
  TrendingUp,
} from '../../ui/icons';
import {
  database,
  WorkoutPlan,
  WorkoutSession,
  WorkoutSet,
} from '../../database';
import { EmptyState } from '../../ui/EmptyState';
import { FeedbackBanner } from '../../ui/FeedbackBanner';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { Row } from '../../ui/Row';
import { ScreenTitle } from '../../ui/ScreenTitle';
import { Pressable, Text, useCSSVariable, View } from '../../ui/primitives';
import { Page, VolumeBar } from '../shared/screen-shared';
import type { TodayScreenProps } from './today-screen.types';
import { useTodayScreen } from './use-today-screen';
import { PerformanceRings } from './performance-rings';

function TodayBase({
  plans,
  sessions,
  sets,
  activeSessions,
}: TodayScreenProps) {
  const primary = useCSSVariable('--primary') as string;
  const onPrimary = useCSSVariable('--on-primary') as string;
  const coral = useCSSVariable('--coral') as string;
  const lime = useCSSVariable('--lime') as string;
  const cyan = useCSSVariable('--cyan') as string;
  const {
    activeSession,
    begin,
    completedSetCount,
    lastSession,
    maxBar,
    message,
    openSession,
    repeat,
    volume,
    weightUnit,
    weekBars,
    working,
  } = useTodayScreen({ plans, sessions, sets, activeSessions });

  return (
    <Page>
      <View className="mb-6 flex-row items-center">
        <BrandMark size={48} />
        <View className="ml-3 flex-1">
          <Text className="text-3xl font-bold tracking-tight text-ink">
            Git<Text className="text-primary">Fit</Text>
          </Text>
          <Text className="text-sm font-semibold text-muted">
            Offline-first training
          </Text>
        </View>
        <View className="rounded-full border border-outline bg-surface px-3 py-2">
          <Text className="text-xs font-semibold text-primary">LOCAL</Text>
        </View>
      </View>
      <ScreenTitle
        title="Your training"
        subtitle="A clear read on momentum, volume, and what comes next."
      />
      {message ? (
        <View className="mb-4">
          <FeedbackBanner message={message} tone="error" />
        </View>
      ) : null}
      {activeSession ? (
        <Pressable
          accessibilityRole="button"
          className="mb-4 min-h-20 flex-row items-center gap-4 rounded-xl bg-primary p-4"
          onPress={() => openSession(activeSession.id)}
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-canvas">
            <Play color={primary} fill={primary} size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-on-primary">
              WORKOUT IN PROGRESS
            </Text>
            <Text className="mt-0.5 text-lg font-bold text-on-primary">
              Resume saved session
            </Text>
          </View>
        </Pressable>
      ) : null}

      <View className="mb-4 flex-row items-center rounded-xl border border-outline bg-surface p-4">
        <View className="flex-1 items-center justify-center pr-1">
          <PerformanceRings
            completedSetCount={completedSetCount}
            sessionCount={sessions.length}
            volume={volume}
          />
        </View>
        <View className="flex-1 items-center gap-3 pl-1">
          {[
            {
              headline: `${completedSetCount} sets`,
              supporting: '20-set goal',
              color: coral,
              Icon: ProgressIcon,
            },
            {
              headline: `${sessions.length} sessions`,
              supporting: '4-session goal',
              color: lime,
              Icon: RotateCcw,
            },
            {
              headline: `${Math.round(volume).toLocaleString()} ${weightUnit}`,
              supporting: `20,000 ${weightUnit} goal`,
              color: cyan,
              Icon: Dumbbell,
            },
          ].map((metric) => (
            <View
              key={metric.headline}
              className="w-full max-w-36 flex-row items-center justify-center gap-2 px-1"
            >
              <View className="w-6 items-center">
                <metric.Icon color={metric.color} size={20} strokeWidth={2} />
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  className="text-base font-bold uppercase"
                  numberOfLines={1}
                  style={{ color: metric.color }}
                >
                  {metric.headline}
                </Text>
                <Text className="text-xs text-muted" numberOfLines={1}>
                  {metric.supporting}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        accessibilityLabel={`Sessions over the last seven days: ${weekBars.join(', ')}`}
        className="mb-5 rounded-xl border border-outline bg-surface p-4"
      >
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-ink">Weekly rhythm</Text>
          <TrendingUp color={cyan} size={20} />
        </View>
        <View className="h-24 flex-row items-end justify-between gap-2">
          {weekBars.map((value, index) => (
            <View key={index} className="flex-1 items-center gap-1">
              <VolumeBar
                active={value > 0}
                height={value > 0 ? Math.max(16, (value / maxBar) * 70) : 10}
              />
              <Text className="text-xs text-muted">
                {
                  ['S', 'M', 'T', 'W', 'T', 'F', 'S'][
                    new Date(Date.now() - (6 - index) * 86400000).getDay()
                  ]
                }
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-7 gap-3">
        <PrimaryButton
          icon={<Play color={onPrimary} fill={onPrimary} size={18} />}
          label="Start an empty workout"
          onPress={() => begin()}
          loading={working}
          disabled={Boolean(activeSession)}
        />
        {lastSession ? (
          <Pressable
            accessibilityRole="button"
            className="min-h-12 flex-row items-center justify-center gap-2 rounded-xl bg-surface px-5 active:opacity-80"
            disabled={Boolean(activeSession)}
            onPress={() => repeat(lastSession.id)}
          >
            <Copy color={primary} size={18} />
            <Text className="text-base font-semibold text-primary">
              Repeat last workout
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Text className="mb-2 text-xl font-bold text-ink">Start from a plan</Text>
      {plans.length ? (
        <View>
          {plans.map((plan) => (
            <Row
              key={plan.id}
              onPress={() => begin(plan.id)}
              subtitle={plan.description || 'Preloaded sets, ready to adjust'}
              title={plan.name}
              trailing={<Play color={primary} size={20} />}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          message="Create a plan once, then start it here with every target set already in place."
          title="No saved plans yet"
        />
      )}

      <View className="mt-8 flex-row items-center gap-3 rounded-xl bg-surface p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-canvas">
          <Dumbbell color={primary} size={20} />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-ink">Local-first by design</Text>
          <Text className="mt-0.5 text-sm leading-5 text-muted">
            No connection is required to plan, train, or review your history.
          </Text>
        </View>
      </View>
    </Page>
  );
}

export const TodayScreen = withObservables([], () => ({
  plans: database
    .get<WorkoutPlan>('workout_plans')
    .query(Q.sortBy('updated_at', Q.desc))
    .observe(),
  sessions: database
    .get<WorkoutSession>('workout_sessions')
    .query(Q.where('end_time', Q.notEq(null)), Q.sortBy('start_time', Q.desc))
    .observe(),
  sets: database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('is_completed', true), Q.sortBy('updated_at', Q.desc))
    .observe(),
  activeSessions: database
    .get<WorkoutSession>('workout_sessions')
    .query(Q.where('end_time', null), Q.sortBy('start_time', Q.desc), Q.take(1))
    .observe(),
}))(TodayBase as any) as React.ComponentType;
