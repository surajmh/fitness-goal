module.exports = {
  displayName: 'mobile',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../../libs'],
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.tsx',
    '<rootDir>/../../libs/**/*.spec.ts',
    '<rootDir>/../../libs/**/*.spec.tsx',
  ],
  moduleNameMapper: {
    '^@fitnessgoal/shared/ui$': '<rootDir>/../../libs/shared/ui/src/index.ts',
    '^@fitnessgoal/data-access/workout$': '<rootDir>/../../libs/data-access/workout/src/index.ts',
    '^@fitnessgoal/feature/(.*)$': '<rootDir>/../../libs/feature/$1/src/index.ts',
    '^@fitnessgoal/feature-shell/app-shell$': '<rootDir>/../../libs/feature-shell/app-shell/src/index.ts',
    '^@fitnessgoal/health-sync-module$': '<rootDir>/../../libs/shared/health-sync-module/index.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
};
