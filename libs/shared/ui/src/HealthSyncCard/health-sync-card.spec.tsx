import React from 'react';
import { HealthSyncCard } from './health-sync-card';

jest.mock('../primitives', () => ({ Text: 'Text', View: 'View' }));
jest.mock('../FeedbackBanner', () => ({ FeedbackBanner: 'FeedbackBanner' }));
jest.mock('../PrimaryButton', () => ({ PrimaryButton: 'PrimaryButton' }));
jest.mock('../TextButton', () => ({ TextButton: 'TextButton' }));
jest.mock('@fitnessgoal/data-access/workout', () => ({
  formatLastHealthSync: () => 'Last synced',
  getHealthAvailabilityMessage: () => '',
  getHealthProviderName: () => 'Health Connect',
}));

describe('HealthSyncCard', () => {
  it('renders provider connection controls', () => {
    const element = HealthSyncCard({
      error: '',
      loading: false,
      onConnect: jest.fn(),
      onOpenSettings: jest.fn(),
      onSync: jest.fn(),
      status: {
        availability: { available: true, provider: 'healthConnect' },
        connected: false,
        lastResultCount: 0,
      },
      syncing: false,
    }) as React.ReactElement<{ children: React.ReactNode }>;

    expect(React.Children.count(element.props.children)).toBeGreaterThan(1);
  });
});
