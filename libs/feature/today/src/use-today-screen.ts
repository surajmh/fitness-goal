import { useState } from 'react';
import {
  duplicateSession,
  startSession,
  useAppState,
  WEEKLY_SESSION_GOAL,
} from '@fitnessgoal/data-access/workout';
import { buildTodaySummary, buildUpNext } from './today-screen.helpers';
import type { TodayScreenProps } from './today-screen.types';

export function useTodayScreen({
  plans,
  planExercises,
  sessions,
  sets,
  activeSessions,
}: TodayScreenProps) {
  const { setActiveSessionId, weightUnit, restTimerSeconds } = useAppState();
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const summary = buildTodaySummary(sessions, sets);

  const begin = async (planId?: string) => {
    try {
      setWorking(true);
      const session = await startSession(planId);
      setActiveSessionId(session.id);
    } catch {
      setMessage(
        'The workout could not be started. Your saved data is unchanged.',
      );
    } finally {
      setWorking(false);
    }
  };

  const repeat = async (sessionId: string) => {
    const next = await duplicateSession(sessionId);
    setActiveSessionId(next.id);
  };

  return {
    ...summary,
    sessionGoal: WEEKLY_SESSION_GOAL,
    activeSession: activeSessions[0],
    lastSession: sessions[0],
    upNext: buildUpNext(plans, planExercises, sessions),
    working,
    message,
    weightUnit,
    restTimerSeconds,
    begin,
    repeat,
    openSession: setActiveSessionId,
  };
}
