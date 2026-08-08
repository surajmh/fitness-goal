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
import { darkTheme, lightTheme, resolveSemanticStyle } from './theme';

export function useCSSVariable(name: string) {
  const scheme = useColorScheme();
  if (process.env.EXPO_OS === 'web') return `var(${name})`;
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return theme[name as keyof typeof theme] ?? '#000000';
}

function useSemanticStyle(className?: string) {
  const scheme = useColorScheme();
  return useMemo(
    () =>
      resolveSemanticStyle(
        className,
        scheme === 'dark' ? darkTheme : lightTheme,
      ),
    [className, scheme],
  );
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
