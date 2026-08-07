import React from 'react';
import Svg, { Path, Circle, Rect, G, Polyline, Defs, LinearGradient, Stop, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function Pencil({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  fill = 'none',
  ...props
}: IconProps) {
  return <Svg width={size} height={size} accessibilityElementsHidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><Path d="m5 16-.8 3.8L8 19l10.2-10.2-3-3Z" /><Path d="m13.8 7.2 3 3" /></Svg>;
}