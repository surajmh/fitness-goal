/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  Copy,
  Download,
  EmptyState,
  FeedbackBanner,
  GroupedList,
  Page,
  Play,
  Pressable,
  PrimaryButton,
  Row,
  ScreenTitle,
  SectionLabel,
  StatTile,
  Text,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import {
  database,
  estimatePlanMinutes,
  PlanExercise,
  WorkoutPlan,
  WorkoutSession,
  WorkoutSet,
} from '@fitnessgoal/data-access/workout';
import {
  countPlanWork,
  formatRelativeDay,
  planInitials,
} from './today-screen.helpers';
import type { TodayScreenProps } from './today-screen.types';
import { useTodayScreen } from './use-today-screen';

function OnDevicePill() {
  const muted = useCSSVariable('--muted') as string;
  return (
    <View className="h-7 flex-row items-center gap-1.5 rounded-full border border-outline bg-surface px-2.5">
      <Download color={muted} size={13} />
      <Text className="text-xs font-semibold text-muted">On device</Text>
    </View>
  );
}

function TodayBase({
  plans,
  planExercises,
  sessions,
  sets,
  activeSessions,
}: TodayScreenProps) {
  const primary = useCSSVariable('--primary') as string;
  const onPrimary = useCSSVariable('--on-primary') as string;
  const {
    activeSession,
    begin,
    lastSession,
    message,
    openSession,
    repeat,
    sessionGoal,
    streakWeeks,
    upNext,
    weekSessions,
    weekVolume,
    restTimerSeconds,
    weightUnit,
    working,
  } = useTodayScreen({ plans, planExercises, sessions, sets, activeSessions });

  const planSubtitle = (planId: string) => {
    const { exerciseCount, setCount } = countPlanWork(planExercises, planId);
    const minutes = estimatePlanMinutes(setCount, restTimerSeconds);
    const exercises = `${exerciseCount} ${exerciseCount === 1 ? 'exercise' : 'exercises'}`;
    return minutes ? `${exercises} · ${minutes} min` : exercises;
  };

  return (
    <Page>
      <ScreenTitle
        title="Today"
        subtitle={new Date().toLocaleDateString('en-AU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
        trailing={<OnDevicePill />}
      />

      {message ? (
        <View className="mb-4">
          <FeedbackBanner message={message} tone="error" />
        </View>
      ) : null}

      {activeSession ? (
        <Pressable
          accessibilityRole="button"
          className="mb-4 min-h-20 flex-row items-center gap-4 rounded-2xl bg-primary p-4"
          onPress={() => openSession(activeSession.id)}
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-canvas">
            <Play color={primary} size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-bold uppercase tracking-wide text-on-primary">
              Workout in progress
            </Text>
            <Text className="mt-0.5 text-lg font-bold text-on-primary">
              Resume saved session
            </Text>
          </View>
        </Pressable>
      ) : null}

      <View className="flex-row gap-2">
        <StatTile
          caption={`${weightUnit} this week`}
          label="Volume"
          role="cyan"
          value={Math.round(weekVolume).toLocaleString()}
        />
        <StatTile
          caption="on plan"
          label="Sessions"
          role="lime"
          value={`${weekSessions} / ${sessionGoal}`}
        />
        <StatTile
          caption={streakWeeks === 1 ? 'week' : 'weeks'}
          label="Streak"
          role="coral"
          value={String(streakWeeks)}
        />
      </View>

      {upNext ? (
        <View className="mt-4 rounded-2xl border border-outline bg-surface-raised p-4">
          <View className="flex-row items-center justify-between">
            <SectionLabel label="Up next" />
            <Text className="text-xs font-semibold tabular-nums text-muted">
              ≈ {estimatePlanMinutes(upNext.setCount, restTimerSeconds)} min
            </Text>
          </View>
          <Text className="mt-2 text-[22px] font-bold tracking-tight text-ink">
            {upNext.plan.name}
          </Text>
          <Text className="mt-1 text-[13px] font-medium text-muted">
            {upNext.exerciseCount}{' '}
            {upNext.exerciseCount === 1 ? 'exercise' : 'exercises'} ·{' '}
            {upNext.setCount} sets
            {upNext.lastDoneAt
              ? ` · last done ${formatRelativeDay(upNext.lastDoneAt)}`
              : ' · never done'}
          </Text>
          <View className="mt-3.5">
            <PrimaryButton
              disabled={Boolean(activeSession)}
              icon={<Play color={onPrimary} size={18} />}
              label="Start workout"
              loading={working}
              onPress={() => begin(upNext.plan.id)}
            />
          </View>
        </View>
      ) : null}

      <View className="mt-3 flex-row gap-2">
        <View className="flex-1">
          <PrimaryButton
            disabled={Boolean(activeSession)}
            label="Empty workout"
            loading={working && !upNext}
            onPress={() => begin()}
            variant="secondary"
          />
        </View>
        {lastSession ? (
          <View className="flex-1">
            <PrimaryButton
              disabled={Boolean(activeSession)}
              icon={<Copy color={primary} size={18} />}
              label="Repeat last"
              onPress={() => repeat(lastSession.id)}
              variant="secondary"
            />
          </View>
        ) : null}
      </View>

      <View className="mt-6 gap-2">
        <SectionLabel label="Saved plans" />
        {plans.length ? (
          <GroupedList inset={50} surface>
            {plans.map((plan) => (
              <Row
                key={plan.id}
                border={false}
                leading={
                  <View className="h-[38px] w-[38px] items-center justify-center rounded-xl bg-primary-soft">
                    <Text className="text-[13px] font-extrabold text-primary">
                      {planInitials(plan.name)}
                    </Text>
                  </View>
                }
                onPress={() => begin(plan.id)}
                subtitle={planSubtitle(plan.id)}
                title={plan.name}
              />
            ))}
          </GroupedList>
        ) : (
          <EmptyState
            message="Create a plan once, then start it here with every target set already in place."
            title="No saved plans yet"
          />
        )}
      </View>
    </Page>
  );
}

export const TodayScreen = withObservables([], () => ({
  plans: database
    .get<WorkoutPlan>('workout_plans')
    .query(Q.sortBy('updated_at', Q.desc))
    .observe(),
  planExercises: database
    .get<PlanExercise>('plan_exercises')
    .query(Q.sortBy('order_index', Q.asc))
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
