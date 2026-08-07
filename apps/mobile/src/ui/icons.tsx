import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
  type SvgProps,
} from 'react-native-svg';

type IconProps = SvgProps & {
  color?: string;
  size?: number;
  strokeWidth?: number;
};

type IconName =
  | 'check'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-plus'
  | 'copy'
  | 'dumbbell'
  | 'ellipsis'
  | 'history'
  | 'home'
  | 'minus'
  | 'pencil'
  | 'plan'
  | 'play'
  | 'plus'
  | 'progress'
  | 'rotate'
  | 'search'
  | 'settings'
  | 'timer'
  | 'trash'
  | 'trend'
  | 'x';

function AppIcon({
  name,
  color = 'currentColor',
  size = 24,
  strokeWidth = 1.8,
  fill = 'none',
  ...props
}: IconProps & { name: IconName }) {
  const common = {
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth,
  };

  return (
    <Svg
      accessibilityElementsHidden
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {name === 'home' ? (
        <>
          <Path
            d="M4.5 10.4 12 4l7.5 6.4v8.1a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5Z"
            {...common}
            fill={fill}
          />
          <Path d="M9.5 20v-6h5v6" {...common} />
        </>
      ) : null}
      {name === 'plan' ? (
        <>
          <Rect x="4" y="3.5" width="16" height="17" rx="2.5" {...common} />
          <Path
            d="m7.5 8 1.2 1.2L11 6.9M13.5 8.2h3M7.5 14l1.2 1.2L11 13m2.5 2.2h3"
            {...common}
          />
        </>
      ) : null}
      {name === 'history' ? (
        <>
          <Path d="M5.2 7.2A8.5 8.5 0 1 1 3.8 15" {...common} />
          <Path d="M5.2 3.8v3.4H1.8M12 7.2v5l3.4 2" {...common} />
        </>
      ) : null}
      {name === 'progress' ? (
        <>
          <Path d="m4 15 4-4 3.3 2.8L17.5 7H21" {...common} />
          <Path d="M5 20v-2m5 2v-4m5 4v-7m5 7V9" {...common} />
        </>
      ) : null}
      {name === 'settings' ? (
        <>
          <Circle cx="12" cy="12" r="3.2" {...common} />
          <Circle cx="12" cy="12" r="7.6" {...common} />
          <Path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"
            {...common}
          />
        </>
      ) : null}
      {name === 'play' ? (
        <Path
          d="M8 5.5v13l10-6.5Z"
          {...common}
          fill={fill === 'none' ? color : fill}
        />
      ) : null}
      {name === 'check' ? <Path d="m5 12.5 4.2 4L19 7" {...common} /> : null}
      {name === 'plus' ? <Path d="M12 5v14M5 12h14" {...common} /> : null}
      {name === 'minus' ? <Path d="M5 12h14" {...common} /> : null}
      {name === 'x' ? <Path d="m6 6 12 12M18 6 6 18" {...common} /> : null}
      {name === 'chevron-right' ? <Path d="m9 5 7 7-7 7" {...common} /> : null}
      {name === 'chevron-up' ? <Path d="m5 15 7-7 7 7" {...common} /> : null}
      {name === 'chevron-down' ? <Path d="m5 9 7 7 7-7" {...common} /> : null}
      {name === 'circle-plus' ? (
        <>
          <Circle cx="12" cy="12" r="8.5" {...common} />
          <Path d="M12 8v8M8 12h8" {...common} />
        </>
      ) : null}
      {name === 'copy' ? (
        <>
          <Rect x="8" y="8" width="11" height="11" rx="2" {...common} />
          <Path
            d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
            {...common}
          />
        </>
      ) : null}
      {name === 'dumbbell' ? (
        <>
          <Path d="M7 12h10" {...common} />
          <Rect x="3" y="8.5" width="3" height="7" rx="1" {...common} />
          <Rect x="18" y="8.5" width="3" height="7" rx="1" {...common} />
        </>
      ) : null}
      {name === 'ellipsis' ? (
        <>
          <Circle cx="6" cy="12" r="1.2" fill={color} />
          <Circle cx="12" cy="12" r="1.2" fill={color} />
          <Circle cx="18" cy="12" r="1.2" fill={color} />
        </>
      ) : null}
      {name === 'pencil' ? (
        <>
          <Path d="m5 16-.8 3.8L8 19l10.2-10.2-3-3Z" {...common} />
          <Path d="m13.8 7.2 3 3" {...common} />
        </>
      ) : null}
      {name === 'rotate' ? (
        <>
          <Path d="M5 8.5A8 8 0 1 1 4.5 16" {...common} />
          <Path d="M5 4.5v4H1" {...common} />
        </>
      ) : null}
      {name === 'trash' ? (
        <>
          <Path d="M5.5 7.5h13l-1 12h-11Z" {...common} />
          <Path d="M4 7.5h16M9 7.5V4.8h6v2.7M10 11v5M14 11v5" {...common} />
        </>
      ) : null}
      {name === 'timer' ? (
        <>
          <Circle cx="12" cy="13" r="7.5" {...common} />
          <Path d="M12 9v4l2.8 1.8M9 3.5h6M18 7l1.5-1.5" {...common} />
        </>
      ) : null}
      {name === 'trend' ? (
        <>
          <Polyline points="4,16 9,11 13,14 20,7" {...common} />
          <Path d="M15.5 7H20v4.5" {...common} />
        </>
      ) : null}
      {name === 'search' ? (
        <>
          <Circle cx="10.5" cy="10.5" r="6" {...common} />
          <Path d="m15 15 4.5 4.5" {...common} />
        </>
      ) : null}
    </Svg>
  );
}

export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <Svg
      accessibilityLabel="GitFit"
      height={size}
      viewBox="0 0 48 48"
      width={size}
    >
      <Defs>
        <LinearGradient id="gitfit-ring" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FF3858" />
          <Stop offset="0.36" stopColor="#38D16A" />
          <Stop offset="0.68" stopColor="#1689F8" />
          <Stop offset="1" stopColor="#B45CF2" />
        </LinearGradient>
      </Defs>
      <Rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="12"
        fill="#10151D"
        stroke="#343D4B"
        strokeWidth="1.5"
      />
      <Circle
        cx="24"
        cy="24"
        r="16"
        fill="none"
        stroke="url(#gitfit-ring)"
        strokeWidth="3"
      />
      <Circle
        cx="24"
        cy="24"
        r="11.5"
        fill="none"
        stroke="#38D16A"
        strokeOpacity="0.72"
        strokeWidth="2"
      />
      <Path
        d="M24 35V14m0 8-6-5m6 11 7-7m-7 2 6-5"
        fill="none"
        stroke="#94E8D1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Circle cx="24" cy="13.5" r="2" fill="#38D16A" />
      <Circle cx="17.5" cy="16.5" r="1.8" fill="#FF3858" />
      <Circle cx="31.5" cy="20.5" r="1.8" fill="#1689F8" />
      <Circle cx="30.5" cy="17.5" r="1.8" fill="#B45CF2" />
    </Svg>
  );
}

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

const icon = (name: IconName) =>
  function Icon(props: IconProps) {
    return <AppIcon name={name} {...props} />;
  };

export const Check = icon('check');
export const ChevronDown = icon('chevron-down');
export const ChevronRight = icon('chevron-right');
export const ChevronUp = icon('chevron-up');
export const CirclePlus = icon('circle-plus');
export const ClipboardList = icon('plan');
export const Copy = icon('copy');
export const Dumbbell = icon('dumbbell');
export const Ellipsis = icon('ellipsis');
export const HistoryIcon = icon('history');
export const HomeIcon = icon('home');
export const Minus = icon('minus');
export const Pencil = icon('pencil');
export const PlanIcon = icon('plan');
export const Play = icon('play');
export const Plus = icon('plus');
export const ProgressIcon = icon('progress');
export const RotateCcw = icon('rotate');
export const Search = icon('search');
export const SettingsIcon = icon('settings');
export const TimerReset = icon('timer');
export const Trash2 = icon('trash');
export const TrendingUp = icon('trend');
export const X = icon('x');
