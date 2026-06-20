'use client';

import { useRouter } from 'next/navigation';
import { WorkflowAnalyticsPage } from '@/app/components/automation/WorkflowAnalyticsPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function WorkflowAnalyticsPageRoute() {
  const router = useRouter();

  return (
    <WorkflowAnalyticsPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
