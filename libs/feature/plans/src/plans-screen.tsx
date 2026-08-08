/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import {
  EmptyState,
  FeedbackBanner,
  GroupedList,
  Page,
  Plus,
  Pressable,
  Row,
  ScreenTitle,
  SectionLabel,
  Text,
  useCSSVariable,
  View,
} from '@fitnessgoal/shared/ui';
import {
  createPlan,
  database,
  deletePlan,
  estimatePlanMinutes,
  Exercise,
  isPlanDifficulty,
  PlanExercise,
  startSession,
  updatePlan,
  useAppState,
  WorkoutPlan,
  WorkoutSession,
} from '@fitnessgoal/data-access/workout';
import { PlanBuilder } from './PlanBuilder';
import { PlanDetail } from './PlanDetail';
import { countPlanSets, groupPlansByDifficulty } from './plans-screen.helpers';
import type { PlansScreenProps } from './plans-screen.types';
import { usePlansScreen } from './use-plans-screen';

function PlansBase({
  plans,
  planExercises,
  exercises,
  activeSessions,
}: PlansScreenProps) {
  const activeSessionPlanId = activeSessions[0]?.planId;
  const onPrimary = useCSSVariable('--on-primary') as string;
  const { setActiveSessionId, restTimerSeconds } = useAppState();
  const {
    building,
    setBuilding,
    message,
    setMessage,
    selectedPlan,
    setSelectedPlan,
  } = usePlansScreen();

  if (selectedPlan) {
    const entries = planExercises
      .filter((item) => item.planId === selectedPlan.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    return (
      <PlanDetail
        entries={entries}
        exercises={exercises}
        onBack={() => setSelectedPlan(null)}
        onDelete={async () => {
          await deletePlan(selectedPlan);
          setSelectedPlan(null);
          setMessage('Plan deleted.');
        }}
        onDuplicate={async () => {
          await createPlan({
            name: `${selectedPlan.name} copy`,
            description: selectedPlan.description,
            difficulty: isPlanDifficulty(selectedPlan.difficulty)
              ? selectedPlan.difficulty
              : 'intermediate',
            exercises: entries.map((entry) => ({
              exerciseId: entry.exerciseId,
              targetSets: entry.targetSets,
              targetReps: entry.targetReps,
            })),
          });
          setSelectedPlan(null);
          setMessage('Plan duplicated.');
        }}
        onStart={async () => {
          const session = await startSession(selectedPlan.id);
          setActiveSessionId(session.id);
        }}
        onUpdate={async (metadata) => {
          await updatePlan(selectedPlan, metadata);
        }}
        plan={selectedPlan}
      />
    );
  }

  if (building) {
    return (
      <PlanBuilder
        exercises={exercises}
        onCancel={() => setBuilding(false)}
        onSave={async (input) => {
          await createPlan(input);
          setBuilding(false);
          setMessage('Workout plan saved.');
        }}
      />
    );
  }

  return (
    <Page>
      <ScreenTitle
        title="Plans"
        subtitle={`${plans.length} ${plans.length === 1 ? 'plan' : 'plans'} · all available offline`}
        trailing={
          <Pressable
            accessibilityLabel="Create workout plan"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-xl bg-primary active:opacity-80"
            onPress={() => {
              setMessage('');
              setBuilding(true);
            }}
          >
            <Plus color={onPrimary} size={20} strokeWidth={2.4} />
          </Pressable>
        }
      />
      {message ? (
        <View className="mb-4">
          <FeedbackBanner message={message} />
        </View>
      ) : null}

      {plans.length ? (
        groupPlansByDifficulty(plans).map((group) => (
          <View key={group.label} className="mb-5 gap-1">
            <SectionLabel label={group.label} />
            <GroupedList>
              {group.plans.map((plan) => {
                const exerciseCount = planExercises.filter(
                  (entry) => entry.planId === plan.id,
                ).length;
                const minutes = estimatePlanMinutes(
                  countPlanSets(planExercises, plan.id),
                  restTimerSeconds,
                );
                return (
                  <Row
                    key={plan.id}
                    border={false}
                    onPress={() => {
                      setMessage('');
                      setSelectedPlan(plan);
                    }}
                    subtitle={`${exerciseCount} ${
                      exerciseCount === 1 ? 'exercise' : 'exercises'
                    }${minutes ? ` · ${minutes} min` : ''}`}
                    title={plan.name}
                    trailing={
                      activeSessionPlanId === plan.id ? (
                        // Never colour alone: the badge spells the state out.
                        <View className="h-[22px] justify-center rounded-md bg-primary-soft px-2">
                          <Text className="text-[10px] font-extrabold tracking-wide text-primary">
                            ACTIVE
                          </Text>
                        </View>
                      ) : undefined
                    }
                  />
                );
              })}
            </GroupedList>
          </View>
        ))
      ) : (
        <EmptyState
          message="Name a session, choose exercises, then set the targets you want ready at workout time."
          title="Build your first plan"
        />
      )}
    </Page>
  );
}

export const PlansScreen = withObservables([], () => ({
  plans: database
    .get<WorkoutPlan>('workout_plans')
    .query(Q.sortBy('updated_at', Q.desc))
    .observe(),
  planExercises: database
    .get<PlanExercise>('plan_exercises')
    .query(Q.sortBy('order_index', Q.asc))
    .observe(),
  exercises: database
    .get<Exercise>('exercises')
    .query(Q.sortBy('name', Q.asc))
    .observe(),
  activeSessions: database
    .get<WorkoutSession>('workout_sessions')
    .query(Q.where('end_time', null), Q.sortBy('start_time', Q.desc), Q.take(1))
    .observe(),
}))(PlansBase as any) as React.ComponentType;
