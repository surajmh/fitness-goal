import React from 'react';
import Svg, { Path, Circle, Rect, G, Polyline, Defs, LinearGradient, Stop, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function Home({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  fill = 'none',
  ...props
}: IconProps) {
  return <Svg width={size} height={size} accessibilityElementsHidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><Path d="M4.5 10.4 12 4l7.5 6.4v8.1a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5Z" /><Path d="M9.5 20v-6h5v6" /></Svg>;
}