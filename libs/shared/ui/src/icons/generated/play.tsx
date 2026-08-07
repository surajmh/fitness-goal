import React from 'react';
import Svg, { Path, Circle, Rect, G, Polyline, Defs, LinearGradient, Stop, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function Play({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  fill = 'none',
  ...props
}: IconProps) {
  return <Svg width={size} height={size} accessibilityElementsHidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><Path d="M8 5.5v13l10-6.5Z" fill="currentColor" /></Svg>;
}