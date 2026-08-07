import {
  formatLastHealthSync,
  getHealthAvailabilityMessage,
  getHealthProviderName,
} from './health-sync.helpers';

describe('health sync helpers', () => {
  it('uses platform provider names', () => {
    expect(
      getHealthProviderName({ available: true, provider: 'appleHealth' }),
    ).toBe('Apple Health');
    expect(
      getHealthProviderName({ available: true, provider: 'healthConnect' }),
    ).toBe('Health Connect');
  });

  it('explains when Health Connect needs installing', () => {
    expect(
      getHealthAvailabilityMessage({
        available: false,
        provider: 'unavailable',
        requiresInstall: true,
      }),
    ).toContain('Install or update');
  });

  it('handles an absent previous sync', () => {
    expect(formatLastHealthSync()).toBe('Not synced yet');
  });
});
