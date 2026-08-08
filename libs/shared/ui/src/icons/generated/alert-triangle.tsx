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
export function AlertTriangle({
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
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M10.3 3.9L2.9 17.2A2 2 0 004.6 20h14.8a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z" />
      <Path d="M12 8v5M12 16.5h.01" />
    </Svg>
  );
}
