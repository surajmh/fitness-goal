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
export function HomeFilled({
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
      <Path
        d="M13.2 2.2a.7.7 0 011.2.63l-1.1 5.67h4.4a.8.8 0 01.62 1.3l-8.5 10.6a.7.7 0 01-1.23-.6l1.2-6.2H5.6a.8.8 0 01-.62-1.3l8.22-10.1z"
        fill={color}
      />
    </Svg>
  );
}
