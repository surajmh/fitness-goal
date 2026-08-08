/** Data roles from the design system — reserved for charts and metrics. */
export type StatRole = 'coral' | 'lime' | 'cyan' | 'recovery';

export type StatTileProps = {
  label: string;
  value: string;
  caption: string;
  role: StatRole;
};
