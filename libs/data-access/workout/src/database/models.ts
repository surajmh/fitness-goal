import { date, field, readonly } from '@nozbe/watermelondb/decorators';
import { Model } from '@nozbe/watermelondb';

abstract class SyncModel extends Model {
  @readonly @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;
}

export class User extends SyncModel {
  static table = 'users';
  @field('rest_timer_default') restTimerDefault: number;
  @field('preferred_weight_unit') preferredWeightUnit: string;
}

export class Exercise extends SyncModel {
  static table = 'exercises';
  @field('name') name: string;
  @field('type') type: string;
  @field('muscle_group') muscleGroup: string;
  @field('equipment') equipment: string;
  @field('is_custom') isCustom: boolean;
  @field('media_url') mediaUrl?: string;
  @field('dataset_id') datasetId?: string;
  @field('body_part') bodyPart?: string;
  @field('target') target?: string;
  @field('secondary_muscles') secondaryMusclesJson?: string;
  @field('instructions') instructions?: string;
  @field('media_frames') mediaFramesJson?: string;

  get secondaryMuscles(): string[] {
    if (!this.secondaryMusclesJson) return [];
    try {
      return JSON.parse(this.secondaryMusclesJson) as string[];
    } catch {
      return [];
    }
  }

  get mediaFrames(): string[] {
    if (!this.mediaFramesJson) return [];
    try {
      return JSON.parse(this.mediaFramesJson) as string[];
    } catch {
      return [];
    }
  }
}

export class WorkoutPlan extends SyncModel {
  static table = 'workout_plans';
  @field('user_id') userId: string;
  @field('name') name: string;
  @field('description') description: string;
}

export class PlanExercise extends SyncModel {
  static table = 'plan_exercises';
  @field('plan_id') planId: string;
  @field('exercise_id') exerciseId: string;
  @field('target_sets') targetSets: number;
  @field('target_reps') targetReps: number;
  @field('order_index') orderIndex: number;
}

export class WorkoutSession extends SyncModel {
  static table = 'workout_sessions';
  @field('user_id') userId: string;
  @field('plan_id') planId?: string;
  @field('start_time') startTime: number;
  @field('end_time') endTime?: number;
  @field('notes') notes: string;
}

export class WorkoutSet extends SyncModel {
  static table = 'workout_sets';
  @field('session_id') sessionId: string;
  @field('exercise_id') exerciseId: string;
  @field('set_number') setNumber: number;
  @field('weight') weight?: number;
  @field('reps') reps?: number;
  @field('duration_seconds') durationSeconds?: number;
  @field('rpe') rpe?: number;
  @field('order_index') orderIndex?: number;
  @field('is_completed') isCompleted: boolean;
}

export class OverloadSetting extends SyncModel {
  static table = 'overload_settings';
  @field('user_id') userId: string;
  @field('exercise_id') exerciseId: string;
  @field('trigger_reps') triggerReps: number;
  @field('increase_weight_by') increaseWeightBy: number;
}

export class BodyMetric extends SyncModel {
  static table = 'body_metrics';
  @field('user_id') userId: string;
  @field('date') date: number;
  @field('body_weight') bodyWeight: number;
  @field('body_fat_percentage') bodyFatPercentage?: number;
}

export class HealthRecord extends SyncModel {
  static table = 'health_records';
  @field('provider') provider: string;
  @field('external_id') externalId: string;
  @field('data_type') dataType: string;
  @field('start_time') startTime: number;
  @field('end_time') endTime: number;
  @field('value') value?: number;
  @field('unit') unit?: string;
  @field('source_name') sourceName: string;
  @field('source_id') sourceId: string;
  @field('metadata_json') metadataJson?: string;
}

export class HealthSyncState extends SyncModel {
  static table = 'health_sync_states';
  @field('provider') provider: string;
  @field('enabled') enabled: boolean;
  @field('last_sync_at') lastSyncAt?: number;
  @field('last_result_count') lastResultCount: number;
  @field('last_error') lastError?: string;
}

export const modelClasses = [
  User,
  Exercise,
  WorkoutPlan,
  PlanExercise,
  WorkoutSession,
  WorkoutSet,
  OverloadSetting,
  BodyMetric,
  HealthRecord,
  HealthSyncState,
];
