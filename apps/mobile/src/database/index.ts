import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { modelClasses } from './models';
import { migrations } from './migrations';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'fitness_goal',
  jsi: true,
  onSetUpError: (error) => {
    console.error('Unable to initialize the local fitness database', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses,
});

export * from './models';
