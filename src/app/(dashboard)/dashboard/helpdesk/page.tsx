'use client';

import { useRouter } from 'next/navigation';
import HelpdeskView from '@/app/components/helpdesk/HelpdeskView';
import { resolveRoute } from '@/app/components/ui/utils';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';

export default function HelpdeskDashboardRoute() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    router.push(resolveRoute(page));
  };

  return (
    <ModuleLayout activeItem="helpdesk" onNavigate={handleNavigate}>
      <HelpdeskView embedMode={true} />
    </ModuleLayout>
  );
}
