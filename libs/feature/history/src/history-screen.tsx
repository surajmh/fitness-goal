/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React, { useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  ChevronDown,
  EmptyState,
  Page,
  Pressable,
  Row,
  ScreenTitle,
  Text,
  useCSSVariable,
  USER_ID,
  View,
} from '@fitnessgoal/shared/ui';
import {
  BodyMetric,
  database,
  deleteSession,
  duplicateSession,
  Exercise,
  useAppState,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import type { HistoryScreenProps } from './history-screen.types';
import { useHistoryScreen } from './use-history-screen';
import { WorkoutDetail } from './WorkoutDetail';
import { AnalyticsView } from './analytics/analytics-view';

function HistoryBase({ sessions, sets, exercises, metrics }: HistoryScreenProps) {
  const [tab, setTab] = useState<'workouts' | 'analytics'>('workouts');
  const { setActiveSessionId, weightUnit } = useAppState();
  const primary = useCSSVariable('--primary') as string;
  const { selected, setSelected, summary } = useHistoryScreen(sets);

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
      <ScreenTitle
        title="History & Analytics"
        subtitle="A durable record of every completed session and your long-term progress."
      />

      <View className="mb-6 flex-row rounded-xl bg-surface p-1">
        <Pressable
          accessibilityRole="button"
          className={`flex-1 items-center justify-center rounded-lg py-2.5 ${
            tab === 'workouts' ? 'bg-surface-raised' : ''
          }`}
          onPress={() => setTab('workouts')}
        >
          <Text
            className={`text-sm font-semibold ${
              tab === 'workouts' ? 'text-ink' : 'text-muted'
            }`}
          >
            Workouts ({sessions.length})
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          className={`flex-1 items-center justify-center rounded-lg py-2.5 ${
            tab === 'analytics' ? 'bg-surface-raised' : ''
          }`}
          onPress={() => setTab('analytics')}
        >
          <Text
            className={`text-sm font-semibold ${
              tab === 'analytics' ? 'text-ink' : 'text-muted'
            }`}
          >
            Analytics
          </Text>
        </Pressable>
      </View>

      {tab === 'workouts' ? (
        <>
          {sessions.map((session) => (
            <Row
              key={session.id}
              onPress={() => setSelected(session)}
              subtitle={`${new Date(session.startTime).toLocaleDateString()} · ${
                session.notes || 'View details'
              }`}
              title={session.planId ? 'Planned workout' : 'Unplanned workout'}
              trailing={<ChevronDown color={primary} size={19} />}
            />
          ))}
          {!sessions.length ? (
            <EmptyState
              message="Finish a workout and it will appear here with a one-tap repeat action."
              title="No completed workouts"
            />
          ) : null}
        </>
      ) : (
        <AnalyticsView exercises={exercises} metrics={metrics} sets={sets} />
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
}))(HistoryBase as any) as React.ComponentType;
