import React from 'react';
import Svg, { Path, Circle, Rect, G, Polyline, Polygon, Line, Defs, LinearGradient, Stop, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function Dumbbell({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.5,
  fill = 'none',
  ...props
}: IconProps) {
  return <Svg width={size} height={size} accessibilityElementsHidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><Path d="M6 12h12" /><Rect x={2} y={8} width={4} height={8} rx={1} /><Rect x={18} y={8} width={4} height={8} rx={1} /><Line x1={1} y1={10} x2={1} y2={14} /><Line x1={23} y1={10} x2={23} y2={14} /></Svg>;
}