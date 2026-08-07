import React from 'react';
import Svg, { Path, Circle, Rect, G, Polyline, Polygon, Line, Defs, LinearGradient, Stop, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function BrandMark({
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.5,
  fill = 'none',
  ...props
}: IconProps) {
  return <Svg width={size} height={size} accessibilityLabel="FitnessGoal" viewBox="0 0 48 48" fill="none" {...props}><Defs><LinearGradient id="gitfit-ring" x1={0} y1={0} x2={1} y2={1}><Stop offset={0} stopColor="#FF3858" /><Stop offset={0.36} stopColor="#38D16A" /><Stop offset={0.68} stopColor="#1689F8" /><Stop offset={1} stopColor="#B45CF2" /></LinearGradient></Defs><Rect x={2.5} y={2.5} width={43} height={43} rx={12} fill="#10151D" stroke="#343D4B" strokeWidth={1.5} /><Circle cx={24} cy={24} r={16} fill="none" stroke="url(#gitfit-ring)" strokeWidth={3} /><Circle cx={24} cy={24} r={11.5} fill="none" stroke="#38D16A" strokeOpacity={0.72} strokeWidth={2} /><Path d="M24 35V14m0 8-6-5m6 11 7-7m-7 2 6-5" fill="none" stroke="#94E8D1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><Circle cx={24} cy={13.5} r={2} fill="#38D16A" /><Circle cx={17.5} cy={16.5} r={1.8} fill="#FF3858" /><Circle cx={31.5} cy={20.5} r={1.8} fill="#1689F8" /><Circle cx={30.5} cy={17.5} r={1.8} fill="#B45CF2" /></Svg>;
}