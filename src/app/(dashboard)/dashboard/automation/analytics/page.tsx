'use client';

import { useRouter } from 'next/navigation';
import { WorkflowAnalyticsPage } from '@/app/components/automation/WorkflowAnalyticsPage';

export default function WorkflowAnalyticsPageRoute() {
  const router = useRouter();

  return (
    <WorkflowAnalyticsPage
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
