import React from 'react';
import { useColorScheme } from 'react-native';
import Svg, { Path, Circle, Rect, G, Polyline, Line, type SvgProps } from 'react-native-svg';
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}
export function BrandMark({ size = 24, ...props }: IconProps) {
  const dark = useColorScheme() === 'dark';
  const tile = dark ? '#16181D' : '#FFFFFF';
  const border = dark ? '#2A2E37' : '#E2E5EA';
  const green = dark ? '#2FD08A' : '#0E8F63';
  return <Svg width={size} height={size} accessibilityLabel="Fitness Goal" viewBox="0 0 1024 1024" fill="none" {...props}><Rect x={40} y={40} width={944} height={944} rx={240} fill={tile} stroke={border} strokeWidth={8} /><G transform="translate(512 512) scale(0.82) translate(-512 -512)"><G fill="none" stroke={green} strokeLinecap="round"><Polyline points="150,720 300,350 445,560 630,300" strokeWidth={66} strokeLinejoin="miter" strokeMiterlimit={6} /><Path d="M 862 466 A 176 176 0 1 0 862 614" strokeWidth={64} /><Line x1={866} y1={540} x2={792} y2={540} strokeWidth={56} /><Circle cx={700} cy={540} r={74} strokeWidth={30} /></G><Circle cx={700} cy={540} r={30} fill={green} /></G></Svg>;
}