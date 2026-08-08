import type React from 'react';

export type ScreenTitleProps = {
  title: string;
  subtitle?: string;
  /** Right-aligned affordance on the title row — a status pill or add button. */
  trailing?: React.ReactNode;
};
