import React from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

export type ExerciseFigureVariant =
  | 'press'
  | 'pull'
  | 'squat'
  | 'hinge'
  | 'core'
  | 'mobility'
  | 'cardio'
  | 'generic';

export function ExerciseFigure({
  color,
  size = 44,
  variant = 'generic',
}: {
  color: string;
  size?: number;
  variant?: ExerciseFigureVariant;
}) {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2.2,
  };

  return (
    <Svg
      accessibilityElementsHidden
      height={size * 0.72}
      viewBox="0 0 52 36"
      width={size}
    >
      {variant === 'press' ? (
        <G>
          <Line x1="6" y1="29" x2="46" y2="29" {...stroke} />
          <Path d="M15 27h22M18 27l4-9h16" {...stroke} />
          <Circle cx="20" cy="16" r="3" fill={color} />
          <Path d="m23 17 10 3 5-6M28 18l-3-7M35 14h9" {...stroke} />
          <Rect x="42" y="10.5" width="3" height="7" rx="1" fill={color} />
          <Rect x="33" y="11.5" width="3" height="5" rx="1" fill={color} />
        </G>
      ) : null}
      {variant === 'squat' ? (
        <G>
          <Circle cx="26" cy="8" r="3" fill={color} />
          <Path
            d="M14 12h24M18 9v6M34 9v6M26 11l-2 9 7 5 4 7M24 20l-7 6-2 6"
            {...stroke}
          />
          <Line x1="10" y1="33" x2="40" y2="33" {...stroke} />
        </G>
      ) : null}
      {variant === 'pull' ? (
        <G>
          <Circle cx="17" cy="10" r="3" fill={color} />
          <Path
            d="m20 12 8 6 10-3M27 18l-7 7-8 1M21 25l8 7M38 8v18M38 15h8"
            {...stroke}
          />
          <Rect x="43" y="11" width="3" height="8" rx="1" fill={color} />
          <Line x1="8" y1="33" x2="42" y2="33" {...stroke} />
        </G>
      ) : null}
      {variant === 'hinge' ? (
        <G>
          <Line x1="7" y1="31" x2="45" y2="31" {...stroke} />
          <Line x1="10" y1="25" x2="42" y2="25" {...stroke} />
          <Rect x="7" y="20.5" width="4" height="9" rx="1.5" fill={color} />
          <Rect x="41" y="20.5" width="4" height="9" rx="1.5" fill={color} />
          <Circle cx="27" cy="7" r="3" fill={color} />
          <Path
            d="m26 11-6 8 8 4 8 1M20 19l-4 12M28 23l8 8M23 15l-4 10M29 15l5 10"
            {...stroke}
          />
        </G>
      ) : null}
      {variant === 'core' ? (
        <G>
          <Line x1="7" y1="31" x2="45" y2="31" {...stroke} />
          <Circle cx="15" cy="20" r="3" fill={color} />
          <Path
            d="m18 21 12 2 8 7M26 22l6-8M31 14l6 3M20 23l-7 8M30 23l-4 8"
            {...stroke}
          />
        </G>
      ) : null}
      {variant === 'mobility' ? (
        <G>
          <Circle cx="25" cy="7" r="3" fill={color} />
          <Path
            d="M25 11v10M25 14 12 18M25 14l13-5M25 21l-9 11M25 21l11 10"
            {...stroke}
          />
          <Line x1="8" y1="33" x2="42" y2="33" {...stroke} />
        </G>
      ) : null}
      {variant === 'cardio' ? (
        <G>
          <Line x1="7" y1="33" x2="45" y2="33" {...stroke} />
          <Circle cx="25" cy="7" r="3" fill={color} />
          <Path
            d="m24 11-5 9 8 4 4 8M20 19l-8 6M27 15l8 5 7-3M27 24l-9 8"
            {...stroke}
          />
          <Path d="M8 12h7M5 17h9" {...stroke} />
        </G>
      ) : null}
      {variant === 'generic' ? (
        <G>
          <Circle cx="26" cy="7" r="3" fill={color} />
          <Path
            d="M26 11v11M26 14l-10 5M26 14l10 5M26 22l-7 10M26 22l7 10M11 19h8M33 19h8"
            {...stroke}
          />
          <Rect x="8" y="15.5" width="3" height="7" rx="1" fill={color} />
          <Rect x="41" y="15.5" width="3" height="7" rx="1" fill={color} />
        </G>
      ) : null}
    </Svg>
  );
}
