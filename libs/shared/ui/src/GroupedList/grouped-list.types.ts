import type React from 'react';

export type GroupedListProps = {
  children: React.ReactNode;
  /**
   * Left inset of the dividers, in points. The design runs the rule up to the
   * text column rather than the screen edge whenever rows carry leading
   * artwork — 56 for a 44pt tile, 60 for a 48pt one.
   */
  inset?: number;
  /** Lift the group onto its own surface. Off for lists that sit on canvas. */
  surface?: boolean;
};
