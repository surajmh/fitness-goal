import {
  addColumns,
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

// Version 1 is the baseline. Add ordered, additive migrations here as the
// local schema evolves so existing offline records remain intact.
export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'workout_sets',
          columns: [
            { name: 'rpe', type: 'number', isOptional: true },
            { name: 'order_index', type: 'number', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'exercises',
          columns: [
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
            {
              name: 'target',
              type: 'string',
              isOptional: true,
              isIndexed: true,
            },
            { name: 'secondary_muscles', type: 'string', isOptional: true },
            { name: 'instructions', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        createTable({
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
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'health_sync_states',
          columns: [
            { name: 'provider', type: 'string', isIndexed: true },
            { name: 'enabled', type: 'boolean' },
            { name: 'last_sync_at', type: 'number', isOptional: true },
            { name: 'last_result_count', type: 'number' },
            { name: 'last_error', type: 'string', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        addColumns({
          table: 'exercises',
          columns: [
            { name: 'media_frames', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
