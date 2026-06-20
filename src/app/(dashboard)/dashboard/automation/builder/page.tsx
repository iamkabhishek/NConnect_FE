'use client';

import { useRouter } from 'next/navigation';
import { WorkflowBuilderPage } from '@/app/components/automation/WorkflowBuilderPage';
import { resolveRoute } from '@/app/components/ui/utils';

export default function WorkflowBuilderPageRoute() {
  const router = useRouter();

  return (
    <WorkflowBuilderPage
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
