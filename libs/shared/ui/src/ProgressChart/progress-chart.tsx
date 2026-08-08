import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { ROLE_TEXT } from '../StatTile';
import { Text, View } from '../primitives';
import { CHART_HEIGHT, CHART_WIDTH } from './progress-chart.constants';
import type { ProgressChartProps } from './progress-chart.types';
import { useProgressChart } from './use-progress-chart';

export function ProgressChart({
  values,
  label,
  unit,
  role = 'coral',
}: ProgressChartProps) {
  const { line, outline, points, path } = useProgressChart(values, role);
  if (!values.length) return null;

  return (
    <View
      accessibilityLabel={`${label}: ${values.join(', ')} ${unit}`}
      className="rounded-2xl bg-surface p-4"
    >
      <View className="mb-3 flex-row items-baseline justify-between">
        <Text className="text-[13px] font-bold text-ink">{label}</Text>
        <Text
          className={`text-lg font-extrabold tabular-nums ${ROLE_TEXT[role]}`}
        >
          {values[values.length - 1].toLocaleString()}
          <Text className="text-xs font-semibold text-muted"> {unit}</Text>
        </Text>
      </View>
      <Svg
        accessibilityElementsHidden
        height={CHART_HEIGHT}
        preserveAspectRatio="none"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
      >
        {[0.25, 0.5, 0.75].map((portion) => (
          <Line
            key={portion}
            stroke={outline}
            strokeWidth={1}
            x1={0}
            x2={CHART_WIDTH}
            y1={CHART_HEIGHT * portion}
            y2={CHART_HEIGHT * portion}
          />
        ))}
        <Path
          d={path}
          fill="none"
          stroke={line}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.6}
        />
        {points.map((point, index) => (
          <Circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            fill={line}
            r={index === points.length - 1 ? 4 : 0}
          />
        ))}
      </Svg>
    </View>
  );
}
