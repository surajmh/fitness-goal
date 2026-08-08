import { useMemo } from 'react';
import type { StatRole } from '../StatTile';
import { useCSSVariable } from '../primitives';
import { buildChart } from './progress-chart.helpers';

export function useProgressChart(values: number[], role: StatRole = 'coral') {
  // A data role, never the interaction role: primary drives controls only.
  const line = useCSSVariable(`--${role}`) as string;
  const outline = useCSSVariable('--outline') as string;
  const chart = useMemo(() => buildChart(values), [values]);
  return { line, outline, ...chart };
}
