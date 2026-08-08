import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
} from 'react-native';
import { ExerciseFigure } from '../icons';
import type { Exercise } from '@fitnessgoal/data-access/workout';
import { Text, View } from '../primitives';
import { useExerciseVisual } from './exercise-artwork';

export function ExerciseMotionPreview({ exercise }: { exercise: Exercise }) {
  const { color, variant } = useExerciseVisual(exercise);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const frames = exercise.mediaFrames;
  const showPhotos = frames.length > 0 && !photoFailed;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 620,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 620,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [progress, reduceMotion]);

  const translateX = variant === 'pull' ? -5 : variant === 'cardio' ? 6 : 0;
  const translateY =
    variant === 'press'
      ? -7
      : variant === 'squat'
        ? 5
        : variant === 'cardio'
          ? -3
          : variant === 'core'
            ? -2
            : 0;
  const rotation =
    variant === 'mobility'
      ? -7
      : variant === 'hinge'
        ? 5
        : variant === 'core'
          ? -4
          : 0;
  const motionStyle = {
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, translateX],
        }),
      },
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, translateY],
        }),
      },
      {
        rotateZ: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${rotation}deg`],
        }),
      },
      {
        scaleY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, variant === 'squat' ? 0.94 : 1],
        }),
      },
    ],
  };
  const haloStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.08, 0.16],
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1.04],
        }),
      },
    ],
  };

  const cue = exercise.instructions?.split('. ')[0];

  return (
    <View
      accessibilityLabel={`${exercise.name} movement preview`}
      accessibilityRole="image"
      className="mb-3 flex-row items-center gap-4 overflow-hidden rounded-xl border border-outline bg-surface p-4"
    >
      <View className="h-24 w-32 items-center justify-center overflow-hidden rounded-lg">
        {showPhotos ? (
          <>
            <Image
              accessibilityIgnoresInvertColors
              onError={() => setPhotoFailed(true)}
              resizeMode="cover"
              source={{ uri: frames[0] }}
              style={StyleSheet.absoluteFill}
            />
            {frames.length > 1 ? (
              <Animated.Image
                accessibilityIgnoresInvertColors
                resizeMode="cover"
                source={{ uri: frames[frames.length - 1] }}
                style={[StyleSheet.absoluteFill, { opacity: progress }]}
              />
            ) : null}
          </>
        ) : (
          <>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 86,
                  height: 86,
                  borderRadius: 43,
                  backgroundColor: color,
                },
                haloStyle,
              ]}
            />
            <Animated.View style={motionStyle}>
              <ExerciseFigure color={color} size={112} variant={variant} />
            </Animated.View>
          </>
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-primary">
          Movement preview
        </Text>
        <Text className="mt-1 text-base font-bold text-ink">
          {exercise.target
            ? `Target: ${exercise.target}`
            : exercise.muscleGroup}
        </Text>
        {cue ? (
          <Text className="mt-1 text-sm leading-5 text-muted" numberOfLines={3}>
            {cue}.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
