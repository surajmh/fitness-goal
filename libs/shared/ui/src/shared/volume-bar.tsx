import Svg, { Rect } from 'react-native-svg';
import { useCSSVariable } from '../primitives';

/**
 * One column of the weekly volume chart. Active weeks take the `cyan` data
 * role (volume); the rest stay `outline` so the recent weeks read first.
 */
export function VolumeBar({
  height,
  active,
}: {
  height: number;
  active: boolean;
}) {
  const cyan = useCSSVariable('--cyan') as string;
  const outline = useCSSVariable('--outline') as string;
  return (
    <Svg
      accessibilityElementsHidden
      height={72}
      preserveAspectRatio="none"
      viewBox="0 0 20 72"
      width="100%"
    >
      <Rect
        x="3"
        y={72 - height}
        width="14"
        height={height}
        rx="3"
        fill={active ? cyan : outline}
      />
    </Svg>
  );
}
