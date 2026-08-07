import { appSchema, tableSchema } from '@nozbe/watermelondb';

const timestamps = [
  { name: 'created_at', type: 'number' as const },
  { name: 'updated_at', type: 'number' as const },
];

export const schema = appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'rest_timer_default', type: 'number' },
        { name: 'preferred_weight_unit', type: 'string' },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'muscle_group', type: 'string', isIndexed: true },
        { name: 'equipment', type: 'string', isIndexed: true },
        { name: 'is_custom', type: 'boolean' },
        { name: 'media_url', type: 'string', isOptional: true },
        {
          name: 'dataset_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
        {
          name: 'body_part',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
        { name: 'target', type: 'string', isOptional: true, isIndexed: true },
        { name: 'secondary_muscles', type: 'string', isOptional: true },
        { name: 'instructions', type: 'string', isOptional: true },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'workout_plans',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'plan_exercises',
      columns: [
        { name: 'plan_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'target_sets', type: 'number' },
        { name: 'target_reps', type: 'number' },
        { name: 'order_index', type: 'number' },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'workout_sessions',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'plan_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'start_time', type: 'number', isIndexed: true },
        { name: 'end_time', type: 'number', isOptional: true },
        { name: 'notes', type: 'string' },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'workout_sets',
      columns: [
        { name: 'session_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'set_number', type: 'number' },
        { name: 'weight', type: 'number', isOptional: true },
        { name: 'reps', type: 'number', isOptional: true },
        { name: 'duration_seconds', type: 'number', isOptional: true },
        { name: 'rpe', type: 'number', isOptional: true },
        { name: 'order_index', type: 'number', isOptional: true },
        { name: 'is_completed', type: 'boolean' },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'overload_settings',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'trigger_reps', type: 'number' },
        { name: 'increase_weight_by', type: 'number' },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'body_metrics',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'number', isIndexed: true },
        { name: 'body_weight', type: 'number' },
        { name: 'body_fat_percentage', type: 'number', isOptional: true },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'health_records',
      columns: [
        { name: 'provider', type: 'string', isIndexed: true },
        { name: 'external_id', type: 'string', isIndexed: true },
        { name: 'data_type', type: 'string', isIndexed: true },
        { name: 'start_time', type: 'number', isIndexed: true },
        { name: 'end_time', type: 'number' },
        { name: 'value', type: 'number', isOptional: true },
        { name: 'unit', type: 'string', isOptional: true },
        { name: 'source_name', type: 'string' },
        { name: 'source_id', type: 'string' },
        { name: 'metadata_json', type: 'string', isOptional: true },
        ...timestamps,
      ],
    }),
    tableSchema({
      name: 'health_sync_states',
      columns: [
        { name: 'provider', type: 'string', isIndexed: true },
        { name: 'enabled', type: 'boolean' },
        { name: 'last_sync_at', type: 'number', isOptional: true },
        { name: 'last_result_count', type: 'number' },
        { name: 'last_error', type: 'string', isOptional: true },
        ...timestamps,
      ],
    }),
  ],
});
