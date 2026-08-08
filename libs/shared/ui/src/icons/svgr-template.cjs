module.exports = function template(variables, { tpl }) {
  return tpl`
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

export function ${variables.componentName}({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  ...props
}: IconProps) {
  return (
    ${variables.jsx}
  );
}
`;
};
