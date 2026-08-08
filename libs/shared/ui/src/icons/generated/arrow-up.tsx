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
export function ArrowUp({
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
      <Path d="M12 19V6m0 0l-6 6m6-6l6 6" />
    </Svg>
  );
}
