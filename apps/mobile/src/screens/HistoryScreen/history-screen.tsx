/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { ChevronDown } from '../../ui/icons';
import { database, Exercise, WorkoutSession, WorkoutSet } from '../../database';
import {
  deleteSession,
  duplicateSession,
} from '../../database/workout-service';
import { useAppState } from '../../state/app-context';
import { EmptyState } from '../../ui/EmptyState';
import { Row } from '../../ui/Row';
import { ScreenTitle } from '../../ui/ScreenTitle';
import { useCSSVariable } from '../../ui/primitives';
import { Page } from '../shared/screen-shared';
import type { HistoryScreenProps } from './history-screen.types';
import { useHistoryScreen } from './use-history-screen';
import { WorkoutDetail } from './WorkoutDetail';

function HistoryBase({ sessions, sets, exercises }: HistoryScreenProps) {
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
        title="History"
        subtitle="A durable record of every completed training session."
      />
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
}))(HistoryBase as any) as React.ComponentType;
