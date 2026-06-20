'use client';

import { useRouter } from 'next/navigation';
import { Dashboard } from '@/app/components/dashboard/Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'campaigns') router.push('/dashboard/campaigns');
    else if (page === 'templates') router.push('/dashboard/templates');
    else if (page === 'contacts') router.push('/dashboard/contacts');
    else if (page === 'automation') router.push('/dashboard/automation');
    else if (page === 'settings') router.push('/dashboard/settings');
    else if (page === 'reports') router.push('/dashboard/reports');
  };

  return (
    <Dashboard onNavigate={handleNavigate} />
  );
}
