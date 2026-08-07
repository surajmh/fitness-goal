import type { ChartPoint } from './progress-chart.types';
import { CHART_HEIGHT, CHART_WIDTH } from './progress-chart.constants';

export function buildChart(values: number[]) {
  if (!values.length) return { points: [] as ChartPoint[], path: '' };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(1, max - min);
  const points = values.map((value, index) => ({
    x: 12 + (index / Math.max(1, values.length - 1)) * (CHART_WIDTH - 24),
    y: 12 + ((max - value) / spread) * (CHART_HEIGHT - 24),
  }));
  return {
    points,
    path: points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`)
      .join(' '),
  };
}
