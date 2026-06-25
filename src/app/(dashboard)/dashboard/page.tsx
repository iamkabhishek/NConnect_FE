'use client';

import { useRouter } from 'next/navigation';
import { Dashboard } from '@/app/components/dashboard/Dashboard';
import { GuestDashboard } from '@/app/components/dashboard/GuestDashboard';
import { useWorkspace } from '@/app/contexts/WorkspaceContext';
import { resolveRoute } from '@/app/components/ui/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useWorkspace();

  const handleNavigate = (page: string) => {
    router.push(resolveRoute(page));
  };

  if (currentUser?.role === 'guest') {
    return (
      <GuestDashboard onNavigate={handleNavigate} />
    );
  }

  return (
    <Dashboard onNavigate={handleNavigate} />
  );
}
