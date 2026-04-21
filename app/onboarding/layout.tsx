import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding | ClickRunClaw',
  description: 'Setup your first AI agent in 3 easy steps.',
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
