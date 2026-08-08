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
  const placeholderInk = useCSSVariable('--placeholder-ink') as string;
  const background =
    variant === 'danger'
      ? 'bg-danger'
      : variant === 'secondary'
        ? 'border-[1.5px] border-outline'
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
        <ActivityIndicator color={disabled ? placeholderInk : onPrimary} />
      ) : (
        <>
          {icon}
          <Text
            className={`text-base font-bold ${
              disabled
                ? 'text-placeholder-ink'
                : variant === 'secondary'
                  ? 'text-ink'
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
