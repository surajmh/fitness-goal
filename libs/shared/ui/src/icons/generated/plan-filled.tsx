import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Polyline,
  Polygon,
  Line,
  Defs,
  LinearGradient,
  Stop,
  type SvgProps,
} from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function PlanFilled({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      accessibilityElementsHidden
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Rect x={8} y={5} width={12} height={2} rx={1} fill={color} />
      <Rect x={8} y={11} width={12} height={2} rx={1} fill={color} />
      <Rect x={8} y={17} width={12} height={2} rx={1} fill={color} />
      <Circle cx={4.5} cy={6} r={1.5} fill={color} />
      <Circle cx={4.5} cy={12} r={1.5} fill={color} />
      <Circle cx={4.5} cy={18} r={1.5} fill={color} />
    </Svg>
  );
}
