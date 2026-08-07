import { Injectable } from '@nestjs/common';

export type SyncTable =
  | 'users'
  | 'exercises'
  | 'workout_plans'
  | 'plan_exercises'
  | 'workout_sessions'
  | 'workout_sets'
  | 'overload_settings'
  | 'body_metrics';

export type SyncChanges = Record<
  SyncTable,
  {
    created: Record<string, unknown>[];
    updated: Record<string, unknown>[];
    deleted: string[];
  }
>;

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'fitness-goal-sync',
      status: 'stubbed',
      message:
        'Mobile data remains authoritative and local. No remote persistence is active.',
    };
  }

  pullChanges(lastPulledAt?: number) {
    return {
      changes: this.emptyChanges(),
      timestamp: Date.now(),
      lastPulledAt: lastPulledAt ?? null,
    };
  }

  acceptPush(changes: Partial<SyncChanges>, lastPulledAt?: number) {
    return {
      accepted: false,
      persisted: false,
      receivedTables: Object.keys(changes),
      lastPulledAt: lastPulledAt ?? null,
      message:
        'Sync transport is reserved but disabled until authentication and durable storage are configured.',
    };
  }

  private emptyChanges(): SyncChanges {
    const tables: SyncTable[] = [
      'users',
      'exercises',
      'workout_plans',
      'plan_exercises',
      'workout_sessions',
      'workout_sets',
      'overload_settings',
      'body_metrics',
    ];
    return Object.fromEntries(
      tables.map((table) => [table, { created: [], updated: [], deleted: [] }]),
    ) as SyncChanges;
  }
}
