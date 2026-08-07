/* eslint-disable @typescript-eslint/no-explicit-any -- WatermelonDB's HOC erases injected observable props. */
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { Plus } from '../../ui/icons';
import { database, Exercise, PlanExercise, WorkoutPlan } from '../../database';
import {
  createPlan,
  deletePlan,
  startSession,
  updatePlan,
} from '../../database/workout-service';
import { useAppState } from '../../state/app-context';
import { EmptyState } from '../../ui/EmptyState';
import { FeedbackBanner } from '../../ui/FeedbackBanner';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { Row } from '../../ui/Row';
import { ScreenTitle } from '../../ui/ScreenTitle';
import { useCSSVariable, View } from '../../ui/primitives';
import { Page } from '../shared/screen-shared';
import { PlanBuilder } from './PlanBuilder';
import { PlanDetail } from './PlanDetail';
import type { PlansScreenProps } from './plans-screen.types';
import { usePlansScreen } from './use-plans-screen';

function PlansBase({ plans, planExercises, exercises }: PlansScreenProps) {
  const onPrimary = useCSSVariable('--on-primary') as string;
  const { setActiveSessionId } = useAppState();
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
        subtitle="Build repeatable sessions that stay fully editable during training."
      />
      <PrimaryButton
        icon={<Plus color={onPrimary} size={20} />}
        label="Create workout plan"
        onPress={() => {
          setMessage('');
          setBuilding(true);
        }}
      />
      {message ? (
        <View className="mt-3">
          <FeedbackBanner message={message} />
        </View>
      ) : null}

      <View className="mt-7">
        {plans.map((plan) => {
          const exerciseCount = planExercises.filter(
            (entry) => entry.planId === plan.id,
          ).length;
          const supporting = `${exerciseCount} ${exerciseCount === 1 ? 'exercise' : 'exercises'}`;
          return (
            <Row
              key={plan.id}
              onPress={() => {
                setMessage('');
                setSelectedPlan(plan);
              }}
              subtitle={
                plan.description
                  ? `${supporting} · ${plan.description}`
                  : supporting
              }
              title={plan.name}
            />
          );
        })}
        {!plans.length ? (
          <EmptyState
            message="Name a session, choose exercises, then set the targets you want ready at workout time."
            title="Build your first plan"
          />
        ) : null}
      </View>
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
}))(PlansBase as any) as React.ComponentType;
