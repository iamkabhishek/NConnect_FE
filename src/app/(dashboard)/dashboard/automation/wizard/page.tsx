'use client';

import { useRouter } from 'next/navigation';
import { WorkflowWizard } from '@/app/components/automation/WorkflowWizard';
import { resolveRoute } from '@/app/components/ui/utils';

export default function WorkflowWizardRoute() {
  const router = useRouter();

  return (
    <WorkflowWizard
      onNavigate={(page) => router.push(resolveRoute(page))}
    />
  );
}
