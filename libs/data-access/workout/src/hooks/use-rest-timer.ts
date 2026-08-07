import { useCallback, useEffect, useRef, useState } from 'react';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { AppState } from 'react-native';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useRestTimer() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const endAt = useRef<number | null>(null);
  const notificationId = useRef<string | null>(null);

  const sync = useCallback(() => {
    if (!endAt.current) return;
    setSecondsLeft(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)));
  }, []);

  useEffect(() => {
    const interval = setInterval(sync, 250);
    const subscription = AppState.addEventListener('change', sync);
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [sync]);

  const start = useCallback(async (seconds: number) => {
    endAt.current = Date.now() + seconds * 1000;
    setSecondsLeft(seconds);
    const permission = await requestPermissionsAsync();
    if (permission.granted) {
      notificationId.current = await scheduleNotificationAsync({
        content: {
          title: 'Rest complete',
          body: 'You are ready for the next set.',
          sound: true,
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
        },
      });
    }
  }, []);

  const cancel = useCallback(async () => {
    endAt.current = null;
    setSecondsLeft(0);
    if (notificationId.current) {
      await cancelScheduledNotificationAsync(notificationId.current);
      notificationId.current = null;
    }
  }, []);

  return { secondsLeft, isRunning: secondsLeft > 0, start, cancel };
}
