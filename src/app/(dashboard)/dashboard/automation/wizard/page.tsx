'use client';

import { useRouter } from 'next/navigation';
import { WorkflowWizard } from '@/app/components/automation/WorkflowWizard';

export default function WorkflowWizardRoute() {
  const router = useRouter();

  return (
    <WorkflowWizard
      onNavigate={(page) => router.push(`/dashboard/${page}`)}
    />
  );
}
