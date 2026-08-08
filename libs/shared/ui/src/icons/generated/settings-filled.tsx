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
export function SettingsFilled({
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
      <Rect x={3} y={7} width={18} height={2} rx={1} fill={color} />
      <Rect x={3} y={15} width={18} height={2} rx={1} fill={color} />
      <Circle cx={15} cy={8} r={3.4} fill={color} />
      <Circle cx={9} cy={16} r={3.4} fill={color} />
    </Svg>
  );
}
