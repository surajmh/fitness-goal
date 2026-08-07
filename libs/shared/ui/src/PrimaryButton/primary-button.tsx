import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Pressable, Text, useCSSVariable } from '../primitives';
import type { PrimaryButtonProps } from './primary-button.types';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
  variant = 'primary',
}: PrimaryButtonProps) {
  const onPrimary = useCSSVariable('--on-primary') as string;
  const muted = useCSSVariable('--muted') as string;
  const background =
    variant === 'danger'
      ? 'bg-danger'
      : variant === 'secondary'
        ? 'bg-surface'
        : 'bg-primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      className={`will-change-pressable min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-5 active:opacity-80 ${
        disabled ? 'bg-outline' : background
      }`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={disabled ? muted : onPrimary} />
      ) : (
        <>
          {icon}
          <Text
            className={`text-base font-semibold ${
              disabled
                ? 'text-muted'
                : variant === 'secondary'
                  ? 'text-primary'
                  : 'text-on-primary'
            }`}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
