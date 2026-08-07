export type FeedbackTone = 'success' | 'error' | 'info';

export type FeedbackBannerProps = {
  message: string;
  tone?: FeedbackTone;
};
