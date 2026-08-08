export type FeedbackTone = 'success' | 'error' | 'info';

export type FeedbackBannerProps = {
  message: string;
  detail?: string;
  tone?: FeedbackTone;
};
