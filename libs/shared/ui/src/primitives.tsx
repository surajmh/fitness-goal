import React, { useMemo } from 'react';
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  useColorScheme,
  View as RNView,
} from 'react-native';
import { useCssElement, useNativeVariable } from 'react-native-css';
import { darkTheme, lightTheme } from './theme';

export function useCSSVariable(name: string) {
  const scheme = useColorScheme();
  if (process.env.EXPO_OS === 'web') return `var(${name})`;
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return theme[name as keyof typeof theme] ?? '#000000';
}

function useSemanticStyle(className?: string) {
  const scheme = useColorScheme();
  return useMemo(() => {
    const theme = scheme === 'dark' ? darkTheme : lightTheme;
    if (!className) return undefined;
    const style: Record<string, string> = {};
    const has = (token: string) =>
      className.split(/\s+/).some((item) => item === token);

    if (has('bg-canvas')) style.backgroundColor = theme['--canvas'];
    if (has('bg-surface')) style.backgroundColor = theme['--surface'];
    if (has('bg-surface-raised'))
      style.backgroundColor = theme['--surface-raised'];
    if (has('bg-primary')) style.backgroundColor = theme['--primary'];
    if (has('bg-outline')) style.backgroundColor = theme['--outline'];
    if (has('bg-success')) style.backgroundColor = theme['--success'];
    if (has('bg-danger')) style.backgroundColor = theme['--danger'];
    if (has('bg-coral')) style.backgroundColor = theme['--coral'];
    if (has('bg-lime')) style.backgroundColor = theme['--lime'];
    if (has('bg-cyan')) style.backgroundColor = theme['--cyan'];
    if (has('bg-recovery')) style.backgroundColor = theme['--recovery'];

    if (has('text-ink')) style.color = theme['--ink'];
    if (has('text-muted')) style.color = theme['--muted'];
    if (has('text-primary')) style.color = theme['--primary'];
    if (has('text-on-primary')) style.color = theme['--on-primary'];
    if (has('text-success')) style.color = theme['--success'];
    if (has('text-danger')) style.color = theme['--danger'];
    if (has('text-coral')) style.color = theme['--coral'];
    if (has('text-lime')) style.color = theme['--lime'];
    if (has('text-cyan')) style.color = theme['--cyan'];
    if (has('text-recovery')) style.color = theme['--recovery'];
    if (has('text-on-recovery')) style.color = theme['--on-recovery'];

    if (has('border-outline')) style.borderColor = theme['--outline'];
    if (has('border-success')) style.borderColor = theme['--success'];
    if (has('border-danger')) style.borderColor = theme['--danger'];

    return Object.keys(style).length ? style : undefined;
  }, [className, scheme]);
}

function useMergedStyle<T>(style: T, semanticStyle?: object) {
  return useMemo(() => [style, semanticStyle], [semanticStyle, style]);
}

export const View = (
  props: React.ComponentProps<typeof RNView> & { className?: string },
) => {
  const semanticStyle = useSemanticStyle(props.className);
  const style = useMergedStyle(props.style, semanticStyle);
  return useCssElement(RNView, { ...props, style }, { className: 'style' });
};

export const Text = (
  props: React.ComponentProps<typeof RNText> & { className?: string },
) => {
  const semanticStyle = useSemanticStyle(props.className);
  const style = useMergedStyle(props.style, semanticStyle);
  return useCssElement(RNText, { ...props, style }, { className: 'style' });
};

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & { className?: string },
) => {
  const semanticStyle = useSemanticStyle(props.className);
  const style = useMergedStyle(props.style, semanticStyle);
  return (
    // @ts-expect-error TypeScript 6 cannot represent this React Native style union.
    useCssElement(RNPressable, { ...props, style }, { className: 'style' })
  );
};

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  },
) => {
  const semanticStyle = useSemanticStyle(props.className);
  const style = useMergedStyle(props.style, semanticStyle);
  return (
    // @ts-expect-error TypeScript 6 cannot represent this React Native style union.
    useCssElement(
      RNScrollView,
      { ...props, style },
      {
        className: 'style',
        contentContainerClassName: 'contentContainerStyle',
      },
    )
  );
};

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & { className?: string },
) => {
  const semanticStyle = useSemanticStyle(props.className);
  const style = useMergedStyle(props.style, semanticStyle);
  return useCssElement(
    RNTextInput,
    { ...props, style },
    { className: 'style' },
  );
};
