import type { StatRole } from '../StatTile';

export type ProgressChartProps = {
  values: number[];
  label: string;
  unit: string;
  /** Data role the line takes. Defaults to `coral` — the progress role. */
  role?: StatRole;
};

export type ChartPoint = { x: number; y: number };
