import type React from 'react';
import { ProgressChart } from './progress-chart';

jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Circle: 'Circle',
  Line: 'Line',
  Path: 'Path',
}));
jest.mock('../primitives', () => ({ Text: 'Text', View: 'View' }));
jest.mock('./use-progress-chart', () => ({
  useProgressChart: () => ({
    line: '#0af',
    outline: '#ddd',
    points: [{ x: 12, y: 12 }],
    path: 'M12 12',
  }),
}));

describe('ProgressChart', () => {
  it('provides an accessible textual summary', () => {
    const element = ProgressChart({
      values: [10],
      label: 'Volume',
      unit: 'lb',
    }) as React.ReactElement<{
      accessibilityLabel: string;
    }>;
    expect(element.props.accessibilityLabel).toBe('Volume: 10 lb');
  });

  it('does not render without values', () => {
    expect(
      ProgressChart({ values: [], label: 'Volume', unit: 'lb' }),
    ).toBeNull();
  });
});
