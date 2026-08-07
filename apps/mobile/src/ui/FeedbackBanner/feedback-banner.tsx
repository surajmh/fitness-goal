import { Text, View } from '../primitives';
import type { FeedbackBannerProps } from './feedback-banner.types';

export function FeedbackBanner({
  message,
  tone = 'success',
}: FeedbackBannerProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      className={`rounded-xl border bg-surface px-4 py-3 ${
        tone === 'error'
          ? 'border-danger'
          : tone === 'success'
            ? 'border-success'
            : 'border-outline'
      }`}
    >
      <Text
        className={`font-semibold ${
          tone === 'error'
            ? 'text-danger'
            : tone === 'success'
              ? 'text-success'
              : 'text-ink'
        }`}
      >
        {message}
      </Text>
    </View>
  );
}
