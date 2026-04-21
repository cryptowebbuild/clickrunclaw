import { Metadata } from 'next';
import { DashboardLayoutClient } from './DashboardLayoutClient';

export const metadata: Metadata = {
  title: 'Dashboard | ClickRunClaw',
  description: 'Manage your AI agents, deployments, and subscription tier.',
  robots: { index: false, follow: false }, // Don't index individual dashboards
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
