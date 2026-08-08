import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * The device's reduce-motion setting, kept live. The app has no preference of
 * its own here on purpose — a second switch would only be able to disagree
 * with the system one.
 */
export function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}
