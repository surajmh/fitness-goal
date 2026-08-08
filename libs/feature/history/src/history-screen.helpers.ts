import type {
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import type {
  HistorySessionSummary,
  SessionTotals,
  SessionWeekGroup,
} from './history-screen.types';

const WEEK_MS = 7 * 86_400_000;
const VOLUME_WEEKS = 7;

/** Volume per week over the last `weekCount` weeks, oldest week first. */
export function buildWeeklyVolume(
  sets: WorkoutSet[],
  weekCount = VOLUME_WEEKS,
  now = new Date(),
) {
  const weeks = Array.from({ length: weekCount }, () => 0);
  for (const item of sets) {
    const weeksBack = Math.floor(
      (now.getTime() - item.createdAt.getTime()) / WEEK_MS,
    );
    if (weeksBack < 0 || weeksBack >= weekCount) continue;
    weeks[weekCount - 1 - weeksBack] += (item.weight ?? 0) * (item.reps ?? 0);
  }
  return weeks;
}

function weekLabel(startTime: number, now: Date) {
  const weeksBack = Math.floor((now.getTime() - startTime) / WEEK_MS);
  if (weeksBack <= 0) return 'This week';
  if (weeksBack === 1) return 'Last week';
  return new Date(startTime).toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Runs of sessions under a shared heading. Relies on `sessions` already being
 * newest-first, which is how the screen queries them.
 */
export function groupSessionsByWeek(
  sessions: WorkoutSession[],
  now = new Date(),
): SessionWeekGroup[] {
  const groups: SessionWeekGroup[] = [];
  for (const session of sessions) {
    const label = weekLabel(session.startTime, now);
    const current = groups[groups.length - 1];
    if (current?.label === label) current.sessions.push(session);
    else groups.push({ label, sessions: [session] });
  }
  return groups;
}

export function summarizeSessions(sets: WorkoutSet[]) {
  const totals = new Map<string, SessionTotals>();
  for (const item of sets) {
    const current = totals.get(item.sessionId) ?? { volume: 0, setCount: 0 };
    current.volume += (item.weight ?? 0) * (item.reps ?? 0);
    current.setCount += 1;
    totals.set(item.sessionId, current);
  }
  return totals;
}

export function formatHistorySpan(
  sessions: WorkoutSession[],
  now = new Date(),
) {
  const oldest = sessions[sessions.length - 1];
  if (!oldest) return 'Nothing logged yet';
  const count = `${sessions.length} ${sessions.length === 1 ? 'session' : 'sessions'}`;
  const months = Math.max(
    1,
    Math.round((now.getTime() - oldest.startTime) / (30 * 86_400_000)),
  );
  return `${count} · ${months} ${months === 1 ? 'month' : 'months'}`;
}

export function formatSessionDate(startTime: number) {
  const date = new Date(startTime);
  return {
    month: date.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
  };
}

export function getSessionSummary(
  sets: WorkoutSet[],
  sessionId: string,
): HistorySessionSummary {
  const sessionSets = sets.filter((item) => item.sessionId === sessionId);
  const grouped = sessionSets.reduce<Record<string, WorkoutSet[]>>(
    (result, item) => {
      (result[item.exerciseId] ??= []).push(item);
      return result;
    },
    {},
  );
  const volume = sessionSets.reduce(
    (total, item) => total + (item.weight ?? 0) * (item.reps ?? 0),
    0,
  );
  return { sessionSets, grouped, volume };
}

export function formatWorkoutDuration(startTime: number, endTime?: number) {
  if (!endTime || endTime <= startTime) return '—';
  const minutes = Math.max(1, Math.round((endTime - startTime) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

export function formatSetPerformance(
  item: WorkoutSet,
  weightUnit: 'lb' | 'kg',
) {
  if (item.weight != null && item.reps != null)
    return `${item.weight.toLocaleString()} ${weightUnit} × ${item.reps}`;
  if (item.durationSeconds != null) {
    const minutes = Math.floor(item.durationSeconds / 60);
    const seconds = item.durationSeconds % 60;
    return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
  if (item.reps != null) return `${item.reps} reps`;
  if (item.weight != null)
    return `${item.weight.toLocaleString()} ${weightUnit}`;
  return 'No result recorded';
}
