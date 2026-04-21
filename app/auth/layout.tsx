import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | ClickRunClaw',
  description: 'Sign in to ClickRunClaw to deploy and manage your AI agents.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
