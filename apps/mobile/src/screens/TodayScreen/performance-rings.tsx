import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useCSSVariable, View } from '../../ui/primitives';

const RING_SIZE = 160;
const RING_CENTER = RING_SIZE / 2;
const RING_WIDTH = 14;
const RINGS = [
  { radius: 58, gradientId: 'progress-ring' },
  { radius: 42, gradientId: 'consistency-ring' },
  { radius: 26, gradientId: 'volume-ring' },
] as const;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
let hasAnimatedThisAppLoad = false;

type PerformanceRingsProps = {
  completedSetCount: number;
  sessionCount: number;
  volume: number;
};

export function PerformanceRings({
  completedSetCount,
  sessionCount,
  volume,
}: PerformanceRingsProps) {
  const outline = useCSSVariable('--outline') as string;
  const coral = useCSSVariable('--coral') as string;
  const lime = useCSSVariable('--lime') as string;
  const cyan = useCSSVariable('--cyan') as string;
  const colors = [coral, lime, cyan];
  const progress = [
    Math.min(1, completedSetCount / 20),
    Math.min(1, sessionCount / 4),
    Math.min(1, volume / 20000),
  ];
  const animationValues = useRef(
    RINGS.map(() => new Animated.Value(hasAnimatedThisAppLoad ? 1 : 0)),
  ).current;

  useEffect(() => {
    let mounted = true;
    const finishImmediately = () => {
      animationValues.forEach((value) => {
        value.stopAnimation();
        value.setValue(1);
      });
    };

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!mounted) return;
      if (reduceMotion || hasAnimatedThisAppLoad) {
        hasAnimatedThisAppLoad = true;
        finishImmediately();
        return;
      }

      hasAnimatedThisAppLoad = true;
      Animated.stagger(
        55,
        animationValues.map((value) =>
          Animated.timing(value, {
            toValue: 1,
            duration: 620,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
        ),
      ).start();
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (reduceMotion) => {
        if (reduceMotion) finishImmediately();
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
      animationValues.forEach((value) => value.stopAnimation());
    };
  }, [animationValues]);

  return (
    <View
      accessibilityLabel={`Progress: ${completedSetCount} sets. Consistency: ${sessionCount} sessions. Volume: ${Math.round(volume).toLocaleString()}.`}
      accessibilityRole="image"
      className="items-center justify-center"
      style={{ aspectRatio: 1, maxWidth: RING_SIZE, width: '100%' }}
    >
      <Svg
        accessibilityElementsHidden
        height="100%"
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        width="100%"
      >
        <Defs>
          {RINGS.map((ring, index) => (
            <LinearGradient
              key={ring.gradientId}
              id={ring.gradientId}
              x1="0"
              x2="1"
              y1="0"
              y2="1"
            >
              <Stop offset="0" stopColor={colors[index]} stopOpacity="0.78" />
              <Stop offset="0.48" stopColor={colors[index]} />
              <Stop offset="1" stopColor={colors[index]} stopOpacity="0.88" />
            </LinearGradient>
          ))}
        </Defs>

        {RINGS.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius;
          const dashOffset = animationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [circumference, circumference * (1 - progress[index])],
          });
          return (
            <React.Fragment key={ring.radius}>
              <Circle
                cx={RING_CENTER}
                cy={RING_CENTER}
                fill="none"
                r={ring.radius}
                stroke={outline}
                strokeOpacity={0.72}
                strokeWidth={RING_WIDTH}
              />
              <AnimatedCircle
                cx={RING_CENTER}
                cy={RING_CENTER}
                fill="none"
                origin={`${RING_CENTER}, ${RING_CENTER}`}
                r={ring.radius}
                rotation={-90}
                stroke={colors[index]}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeOpacity={0.12}
                strokeWidth={RING_WIDTH + 7}
              />
              <AnimatedCircle
                cx={RING_CENTER}
                cy={RING_CENTER}
                fill="none"
                origin={`${RING_CENTER}, ${RING_CENTER}`}
                r={ring.radius}
                rotation={-90}
                stroke={`url(#${ring.gradientId})`}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeWidth={RING_WIDTH}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
