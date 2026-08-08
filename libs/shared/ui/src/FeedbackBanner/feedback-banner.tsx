import { AlertTriangle, Check, Info } from '../icons';
import { Text, useCSSVariable, View } from '../primitives';
import type { FeedbackBannerProps } from './feedback-banner.types';

const TONES = {
  success: { background: 'bg-success-soft', token: '--success', Icon: Check },
  error: {
    background: 'bg-danger-soft',
    token: '--danger',
    Icon: AlertTriangle,
  },
  info: { background: 'bg-surface', token: '--muted', Icon: Info },
} as const;

export function FeedbackBanner({
  message,
  detail,
  tone = 'success',
}: FeedbackBannerProps) {
  const { background, token, Icon } = TONES[tone];
  const color = useCSSVariable(token) as string;
  return (
    <View
      accessibilityLiveRegion="polite"
      className={`flex-row gap-2.5 rounded-xl px-4 py-3 ${background}`}
    >
      <Icon color={color} size={18} aria-hidden />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-bold text-ink">{message}</Text>
        {detail ? (
          <Text className="text-sm leading-5 text-muted">{detail}</Text>
        ) : null}
      </View>
    </View>
  );
}
