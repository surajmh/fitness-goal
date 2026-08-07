module.exports = {
  displayName: 'mobile',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
};
