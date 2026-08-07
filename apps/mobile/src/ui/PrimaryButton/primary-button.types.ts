import type React from 'react';

export type PrimaryButtonVariant = 'primary' | 'secondary' | 'danger';

export type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: PrimaryButtonVariant;
};
