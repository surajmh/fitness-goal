/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React, { useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  EmptyState,
  GroupedList,
  Page,
  Pressable,
  Row,
  ScreenTitle,
  SectionLabel,
  Text,
  USER_ID,
  View,
  VolumeBar,
} from '@fitnessgoal/shared/ui';
import {
  BodyMetric,
  database,
  deleteSession,
  duplicateSession,
  Exercise,
  HealthRecord,
  useAppState,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import {
  formatSessionDate,
  formatWorkoutDuration,
} from './history-screen.helpers';
import type { HistoryScreenProps } from './history-screen.types';
import { useHistoryScreen } from './use-history-screen';
import { WorkoutDetail } from './WorkoutDetail';
import { AnalyticsView } from './analytics/analytics-view';

function DateTile({ startTime }: { startTime: number }) {
  const { month, day } = formatSessionDate(startTime);
  return (
    <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface">
      <Text className="text-[9px] font-bold tabular-nums text-muted">
        {month}
      </Text>
      <Text className="text-[15px] font-extrabold leading-none tabular-nums text-ink">
        {day}
      </Text>
    </View>
  );
}

function HistoryBase({
  sessions,
  sets,
  exercises,
  metrics,
  sleepRecords,
}: HistoryScreenProps) {
  const [tab, setTab] = useState<'workouts' | 'analytics'>('workouts');
  const { setActiveSessionId, weightUnit } = useAppState();
  const {
    selected,
    setSelected,
    summary,
    span,
    weeklyVolume,
    maxVolume,
    groups,
    totals,
  } = useHistoryScreen(sessions, sets);

  if (selected && summary) {
    return (
      <WorkoutDetail
        exercises={exercises}
        onBack={() => setSelected(null)}
        onDelete={async () => {
          await deleteSession(selected);
          setSelected(null);
        }}
        onRepeat={async () => {
          const copy = await duplicateSession(selected.id);
          setActiveSessionId(copy.id);
        }}
        session={selected}
        summary={summary}
        weightUnit={weightUnit}
      />
    );
  }

  return (
    <Page>
      <ScreenTitle title="History" subtitle={span} />

      <View className="mb-5 flex-row rounded-xl bg-surface p-1">
        {(['workouts', 'analytics'] as const).map((key) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === key }}
            className={`flex-1 items-center justify-center rounded-lg py-2.5 ${
              tab === key ? 'bg-surface-raised' : ''
            }`}
            onPress={() => setTab(key)}
          >
            <Text
              className={`text-sm font-semibold capitalize ${
                tab === key ? 'text-ink' : 'text-muted'
              }`}
            >
              {key === 'workouts'
                ? `Workouts (${sessions.length})`
                : 'Progress'}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'workouts' ? (
        <>
          <View
            accessibilityLabel={`Volume over the last seven weeks: ${weeklyVolume
              .map((value) => Math.round(value))
              .join(', ')} ${weightUnit}`}
            className="h-24 flex-row items-end gap-1.5 rounded-2xl bg-surface p-3.5"
          >
            {weeklyVolume.map((value, index) => (
              <View key={index} className="flex-1">
                <VolumeBar
                  active={value > 0}
                  height={
                    value > 0 ? Math.max(10, (value / maxVolume) * 68) : 6
                  }
                />
              </View>
            ))}
          </View>

          {groups.map((group) => (
            <View key={group.label} className="mt-5 gap-1">
              <SectionLabel label={group.label} />
              <GroupedList inset={56}>
                {group.sessions.map((session) => {
                  const total = totals.get(session.id);
                  return (
                    <Row
                      key={session.id}
                      border={false}
                      leading={<DateTile startTime={session.startTime} />}
                      onPress={() => setSelected(session)}
                      subtitle={[
                        formatWorkoutDuration(
                          session.startTime,
                          session.endTime,
                        ),
                        `${Math.round(total?.volume ?? 0).toLocaleString()} ${weightUnit}`,
                        `${total?.setCount ?? 0} sets`,
                      ].join(' · ')}
                      title={
                        session.planId ? 'Planned workout' : 'Unplanned workout'
                      }
                    />
                  );
                })}
              </GroupedList>
            </View>
          ))}

          {!sessions.length ? (
            <EmptyState
              message="Finish a workout and it will appear here with a one-tap repeat action."
              title="No completed workouts"
            />
          ) : null}
        </>
      ) : (
        <AnalyticsView
          exercises={exercises}
          metrics={metrics}
          sessions={sessions}
          sets={sets}
          sleepRecords={sleepRecords}
        />
      )}
    </Page>
  );
}

export const HistoryScreen = withObservables([], () => ({
  sessions: database
    .get<WorkoutSession>('workout_sessions')
    .query(Q.where('end_time', Q.notEq(null)), Q.sortBy('start_time', Q.desc))
    .observe(),
  sets: database
    .get<WorkoutSet>('workout_sets')
    .query(Q.where('is_completed', true), Q.sortBy('created_at', Q.asc))
    .observe(),
  exercises: database.get<Exercise>('exercises').query().observe(),
  metrics: database
    .get<BodyMetric>('body_metrics')
    .query(Q.where('user_id', USER_ID), Q.sortBy('date', Q.desc), Q.take(12))
    .observe(),
  sleepRecords: database
    .get<HealthRecord>('health_records')
    .query(Q.where('data_type', 'sleep'), Q.sortBy('end_time', Q.desc))
    .observe(),
}))(HistoryBase as any) as React.ComponentType;
