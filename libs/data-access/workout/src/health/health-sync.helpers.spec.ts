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

  it('shows the time for today and the date before that', () => {
    const now = new Date('2026-08-08T20:00:00');
    expect(
      formatLastHealthSync(new Date('2026-08-08T08:12:00').getTime(), now),
    ).toBe('Last synced 08:12');
    expect(
      formatLastHealthSync(new Date('2026-08-06T08:12:00').getTime(), now),
    ).toBe('Last synced 6 Aug');
  });
});
