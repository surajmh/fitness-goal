import React from 'react';
import Svg, { Path, Circle, Rect, G, Polyline, Defs, LinearGradient, Stop, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function Plan({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  fill = 'none',
  ...props
}: IconProps) {
  return <Svg width={size} height={size} accessibilityElementsHidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><Rect x={4} y={3.5} width={16} height={17} rx={2.5} /><Path d="m7.5 8 1.2 1.2L11 6.9M13.5 8.2h3M7.5 14l1.2 1.2L11 13m2.5 2.2h3" /></Svg>;
}