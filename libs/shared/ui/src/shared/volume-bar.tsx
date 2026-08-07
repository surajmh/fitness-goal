import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useCSSVariable } from '../primitives';

export function VolumeBar({
  height,
  active,
}: {
  height: number;
  active: boolean;
}) {
  const outline = useCSSVariable('--outline') as string;
  return (
    <Svg
      accessibilityElementsHidden
      height={72}
      preserveAspectRatio="none"
      viewBox="0 0 20 72"
      width="100%"
    >
      <Defs>
        <LinearGradient id="volume-bar" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#9CEB43" />
          <Stop offset="1" stopColor="#42D5F5" />
        </LinearGradient>
      </Defs>
      <Rect
        x="3"
        y={72 - height}
        width="14"
        height={height}
        rx="3"
        fill={active ? 'url(#volume-bar)' : outline}
      />
    </Svg>
  );
}
