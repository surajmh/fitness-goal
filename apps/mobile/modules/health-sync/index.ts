// Re-export the native module. On web, it will be resolved to HealthSyncModule.web.ts
// and on native platforms to HealthSyncModule.ts
export { default } from './src/HealthSyncModule';
export * from './src/HealthSync.types';
