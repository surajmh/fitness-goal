import { useMemo } from 'react';
import { useCSSVariable } from '../primitives';
import { buildChart } from './progress-chart.helpers';

export function useProgressChart(values: number[]) {
  const primary = useCSSVariable('--primary') as string;
  const outline = useCSSVariable('--outline') as string;
  const chart = useMemo(() => buildChart(values), [values]);
  return { primary, outline, ...chart };
}
