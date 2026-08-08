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
export function HistoryFilled({
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
        d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12.9 7.6v4.1l2.7 1.8a1 1 0 01-1.1 1.66l-3.15-2.1a1 1 0 01-.45-.83V7.6a1 1 0 012 0z"
        fill={color}
      />
    </Svg>
  );
}
