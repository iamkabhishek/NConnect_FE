'use client';

import { useRouter } from 'next/navigation';
import ClientHelpdesk from '@/app/helpdesk/page';
import { ModuleLayout } from '@/app/components/layout/ModuleLayout';
import { resolveRoute } from '@/app/components/ui/utils';

export default function HelpdeskDashboardRoute() {
  const router = useRouter();

  return (
    <ModuleLayout
      activeItem="helpdesk"
      onNavigate={(page) => router.push(resolveRoute(page))}
    >
      <ClientHelpdesk embedMode={true} />
    </ModuleLayout>
  );
}
