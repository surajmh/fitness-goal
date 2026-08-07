import { buildChart } from './progress-chart.helpers';

describe('buildChart', () => {
  it('builds one point per value', () => {
    const chart = buildChart([10, 20, 15]);
    expect(chart.points).toHaveLength(3);
    expect(chart.path.startsWith('M')).toBe(true);
  });
  it('handles empty input', () => {
    expect(buildChart([])).toEqual({ points: [], path: '' });
  });
});
