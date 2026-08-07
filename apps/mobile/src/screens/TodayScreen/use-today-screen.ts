import { useState } from 'react';
import { duplicateSession, startSession } from '../../database/workout-service';
import { useAppState } from '../../state/app-context';
import { buildTodaySummary } from './today-screen.helpers';
import type { TodayScreenProps } from './today-screen.types';

export function useTodayScreen({
  sessions,
  sets,
  activeSessions,
}: TodayScreenProps) {
  const { setActiveSessionId, weightUnit } = useAppState();
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
    activeSession: activeSessions[0],
    lastSession: sessions[0],
    working,
    message,
    weightUnit,
    begin,
    repeat,
    openSession: setActiveSessionId,
  };
}
