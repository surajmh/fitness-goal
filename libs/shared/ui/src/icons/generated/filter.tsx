import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import type { IconProps } from './check';

export function Filter({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.5,
  fill = 'none',
  ...props
}: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill={fill}
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </Svg>
  );
}
