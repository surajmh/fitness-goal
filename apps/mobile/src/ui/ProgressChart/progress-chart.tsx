import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Text, View } from '../primitives';
import { CHART_HEIGHT, CHART_WIDTH } from './progress-chart.constants';
import type { ProgressChartProps } from './progress-chart.types';
import { useProgressChart } from './use-progress-chart';

export function ProgressChart({ values, label, unit }: ProgressChartProps) {
  const { primary, outline, points, path } = useProgressChart(values);
  if (!values.length) return null;

  return (
    <View
      accessibilityLabel={`${label}: ${values.join(', ')} ${unit}`}
      className="rounded-xl bg-surface p-4"
    >
      <View className="mb-3 flex-row items-baseline justify-between">
        <Text className="text-sm font-semibold text-muted">{label}</Text>
        <Text className="text-lg font-bold text-ink">
          {values[values.length - 1]} {unit}
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
          stroke={primary}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
        {points.map((point, index) => (
          <Circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            fill={primary}
            r={index === points.length - 1 ? 5 : 3}
          />
        ))}
      </Svg>
    </View>
  );
}
