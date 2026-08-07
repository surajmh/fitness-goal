import type React from 'react';

export type RowProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  border?: boolean;
};

